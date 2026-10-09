"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface DiagramNode {
  id: string;
  label: string;
  type?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface DiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  projectSlug?: string;
  className?: string;
}

const BOX_W = 180;
const BOX_H = 56;

// Canonical, hand-crafted layout presets for known projects
const CANONICAL_PRESETS: Record<
  string,
  {
    width: number;
    height: number;
    positions: Record<string, { x: number; y: number }>;
  }
> = {
  "kafka-clone": {
    width: 1300,
    height: 380,
    positions: {
      producer: { x: 140, y: 100 },
      acceptor: { x: 470, y: 100 },
      partition: { x: 810, y: 100 },
      commitlog: { x: 1140, y: 100 },
      binaryindex: { x: 810, y: 260 },
      consumer: { x: 1140, y: 260 },
    },
  },
  "plantiq-capstone": {
    width: 1320,
    height: 380,
    positions: {
      client: { x: 140, y: 100 },
      vision: { x: 480, y: 100 },
      rag: { x: 820, y: 100 },
      llm: { x: 1160, y: 100 },
      prerouter: { x: 480, y: 260 },
      ccri: { x: 820, y: 260 },
    },
  },
  quacky: {
    width: 1300,
    height: 380,
    positions: {
      ui: { x: 140, y: 100 },
      viewmodel: { x: 480, y: 100 },
      engine: { x: 820, y: 100 },
      hardware: { x: 1150, y: 100 },
      room: { x: 480, y: 260 },
    },
  },
  "moody-foody": {
    width: 1520,
    height: 240,
    positions: {
      user: { x: 130, y: 110 },
      intent: { x: 440, y: 110 },
      fastapi: { x: 760, y: 110 },
      validation: { x: 1080, y: 110 },
      mysql: { x: 1390, y: 110 },
    },
  },
  portfolio: {
    width: 1140,
    height: 460,
    positions: {
      client: { x: 140, y: 220 },
      glsl: { x: 530, y: 90 },
      nextjs: { x: 530, y: 220 },
      webaudio: { x: 530, y: 350 },
      githubapi: { x: 960, y: 220 },
    },
  },
};

/**
 * Fallback automatic topological DAG layout calculator for unknown projects
 */
function computeFallbackLayout(nodes: DiagramNode[], edges: DiagramEdge[]) {
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};
  nodes.forEach((n) => {
    inDegree[n.id] = 0;
    adj[n.id] = [];
  });
  edges.forEach((e) => {
    if (adj[e.from]) adj[e.from].push(e.to);
    if (inDegree[e.to] !== undefined) inDegree[e.to]++;
  });

  const rank: Record<string, number> = {};
  const queue: string[] = [];
  nodes.forEach((n) => {
    if (inDegree[n.id] === 0) {
      rank[n.id] = 0;
      queue.push(n.id);
    }
  });

  if (queue.length === 0 && nodes.length > 0) {
    rank[nodes[0].id] = 0;
    queue.push(nodes[0].id);
  }

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const currRank = rank[curr] || 0;
    for (const next of adj[curr] || []) {
      const nextRank = rank[next] ?? -1;
      if (currRank + 1 > nextRank) {
        rank[next] = currRank + 1;
        queue.push(next);
      }
    }
  }

  nodes.forEach((n) => {
    if (rank[n.id] === undefined) rank[n.id] = 0;
  });

  const rankGroups: Record<number, string[]> = {};
  let maxRank = 0;
  nodes.forEach((n) => {
    const r = rank[n.id];
    if (r > maxRank) maxRank = r;
    if (!rankGroups[r]) rankGroups[r] = [];
    rankGroups[r].push(n.id);
  });

  const positions: Record<string, { x: number; y: number }> = {};
  let maxColCount = 1;
  Object.keys(rankGroups).forEach((rStr) => {
    const r = parseInt(rStr, 10);
    const group = rankGroups[r];
    if (group.length > maxColCount) maxColCount = group.length;
    group.forEach((nodeId, idx) => {
      positions[nodeId] = {
        x: 140 + r * 340,
        y: 100 + idx * 160,
      };
    });
  });

  const width = Math.max(900, 140 + (maxRank + 1) * 340);
  const height = Math.max(280, 100 + maxColCount * 160);

  return { positions, width, height };
}

/**
 * Calculates exact ray-box intersection with node boundary
 */
function getNodeAnchor(
  from: { x: number; y: number },
  to: { x: number; y: number },
  w = BOX_W,
  h = BOX_H
) {
  const hw = w / 2;
  const hh = h / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
    return { x: from.x, y: from.y, side: "center", dir: { x: 0, y: 0 } };
  }

  const scaleX = hw / Math.abs(dx);
  const scaleY = hh / Math.abs(dy);
  const scale = Math.min(scaleX, scaleY);

  const x = from.x + dx * scale;
  const y = from.y + dy * scale;
  const side =
    scale === scaleX ? (dx > 0 ? "right" : "left") : dy > 0 ? "bottom" : "top";

  const dirMap: Record<string, { x: number; y: number }> = {
    right: { x: 1, y: 0 },
    left: { x: -1, y: 0 },
    bottom: { x: 0, y: 1 },
    top: { x: 0, y: -1 },
    center: { x: 0, y: 0 },
  };

  return { x, y, side, dir: dirMap[side] };
}

/**
 * Generates smooth cubic Bezier path and midpoint for edge labels
 */
function getEdgeCurve(
  from: { x: number; y: number },
  to: { x: number; y: number },
  w = BOX_W,
  h = BOX_H
) {
  const start = getNodeAnchor(from, to, w, h);
  const end = getNodeAnchor(to, from, w, h);

  const dist = Math.max(32, Math.hypot(end.x - start.x, end.y - start.y) * 0.35);
  const cp1 = {
    x: start.x + start.dir.x * dist,
    y: start.y + start.dir.y * dist,
  };
  const cp2 = {
    x: end.x + end.dir.x * dist,
    y: end.y + end.dir.y * dist,
  };

  // Cubic Bezier midpoint at t = 0.5
  const t = 0.5;
  const midX =
    (1 - t) ** 3 * start.x +
    3 * (1 - t) ** 2 * t * cp1.x +
    3 * (1 - t) * t ** 2 * cp2.x +
    t ** 3 * end.x;
  const midY =
    (1 - t) ** 3 * start.y +
    3 * (1 - t) ** 2 * t * cp1.y +
    3 * (1 - t) * t ** 2 * cp2.y +
    t ** 3 * end.y;

  return {
    d: `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${cp1.x.toFixed(1)} ${cp1.y.toFixed(1)}, ${cp2.x.toFixed(1)} ${cp2.y.toFixed(1)}, ${end.x.toFixed(1)} ${end.y.toFixed(1)}`,
    midX,
    midY,
  };
}

export function Diagram({
  nodes,
  edges,
  projectSlug,
  className,
}: DiagramProps) {
  // Determine canonical layout preset or dynamic fallback
  const initialLayout = useMemo(() => {
    if (projectSlug && CANONICAL_PRESETS[projectSlug]) {
      const preset = CANONICAL_PRESETS[projectSlug];
      // Verify all nodes exist in preset
      const hasAll = nodes.every((n) => preset.positions[n.id]);
      if (hasAll) {
        return {
          positions: { ...preset.positions },
          width: preset.width,
          height: preset.height,
        };
      }
    }
    return computeFallbackLayout(nodes, edges);
  }, [projectSlug, nodes, edges]);

  // Reactive node coordinates allowing user drag-and-drop
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    initialLayout.positions
  );

  // Sync positions if layout props change
  useEffect(() => {
    setPositions(initialLayout.positions);
  }, [initialLayout]);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);

  const dragOffsetRef = useRef<{
    startX: number;
    startY: number;
    nodeStartX: number;
    nodeStartY: number;
    svg: SVGSVGElement;
  } | null>(null);

  // Handle pointer drag initiation
  const handlePointerDown = useCallback(
    (nodeId: string, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const svg = e.currentTarget.closest("svg");
      if (!svg) return;

      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      const svgP = ctm
        ? pt.matrixTransform(ctm.inverse())
        : { x: e.clientX, y: e.clientY };

      setDraggingNodeId(nodeId);
      const cur = positions[nodeId] || { x: 0, y: 0 };
      dragOffsetRef.current = {
        startX: svgP.x,
        startY: svgP.y,
        nodeStartX: cur.x,
        nodeStartY: cur.y,
        svg,
      };
    },
    [positions]
  );

  // Global window pointermove and pointerup listeners during active dragging
  useEffect(() => {
    if (!draggingNodeId) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragOffsetRef.current) return;
      const { startX, startY, nodeStartX, nodeStartY, svg } = dragOffsetRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      const svgP = ctm
        ? pt.matrixTransform(ctm.inverse())
        : { x: e.clientX, y: e.clientY };

      const dx = svgP.x - startX;
      const dy = svgP.y - startY;

      setPositions((prev) => ({
        ...prev,
        [draggingNodeId]: {
          x: Math.round(nodeStartX + dx),
          y: Math.round(nodeStartY + dy),
        },
      }));
    };

    const handlePointerUp = () => {
      setDraggingNodeId(null);
      dragOffsetRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [draggingNodeId]);

  // Handle ESC key and scroll locking when lightbox is expanded
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const resetLayout = useCallback(() => {
    setPositions(initialLayout.positions);
    setZoom(1);
  }, [initialLayout]);

  const svgWidth = initialLayout.width;
  const svgHeight = initialLayout.height;

  // Shared SVG diagram content
  const renderSvgContent = (isModal = false) => {
    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className={cn(
          "w-full h-auto select-none transition-transform duration-200",
          isModal ? "max-h-[80vh]" : "min-w-[640px]"
        )}
        style={{
          transform: isModal ? `scale(${zoom})` : undefined,
          transformOrigin: "center center",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle dot matrix grid pattern */}
          <pattern
            id="diagram-grid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="12" cy="12" r="0.8" fill="rgba(255,255,255,0.06)" />
          </pattern>

          {/* Regular edge arrowhead */}
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <polygon
              points="0 1, 8 4, 0 7"
              fill="var(--bone)"
              opacity="0.75"
            />
          </marker>

          {/* Active highlighted edge arrowhead */}
          <marker
            id="arrowhead-active"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <polygon points="0 1, 8 4, 0 7" fill="var(--sun)" opacity="1" />
          </marker>
        </defs>

        {/* Grid Background */}
        <rect width="100%" height="100%" fill="url(#diagram-grid)" />

        {/* Layer 1: Edges Lines */}
        <g id="diagram-edges">
          {edges.map((edge, idx) => {
            const fromPos = positions[edge.from];
            const toPos = positions[edge.to];
            if (!fromPos || !toPos) return null;

            const isRelated =
              hoveredNodeId === null ||
              hoveredNodeId === edge.from ||
              hoveredNodeId === edge.to;
            const isHighlighted =
              hoveredNodeId !== null &&
              (hoveredNodeId === edge.from || hoveredNodeId === edge.to);

            const curve = getEdgeCurve(fromPos, toPos);

            return (
              <g
                key={`edge-line-${idx}`}
                className="transition-opacity duration-200"
                style={{ opacity: isRelated ? 1 : 0.2 }}
              >
                <path
                  d={curve.d}
                  fill="none"
                  stroke={isHighlighted ? "var(--sun)" : "var(--bone)"}
                  strokeOpacity={isHighlighted ? 0.95 : 0.45}
                  strokeWidth={isHighlighted ? 2.2 : 1.5}
                  markerEnd={
                    isHighlighted
                      ? "url(#arrowhead-active)"
                      : "url(#arrowhead)"
                  }
                />
              </g>
            );
          })}
        </g>

        {/* Layer 2: Node Boxes */}
        <g id="diagram-nodes">
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;

            const isHovered = hoveredNodeId === node.id;
            const isDragging = draggingNodeId === node.id;

            // Type category accent color
            const typeLower = (node.type || "").toLowerCase();
            const accentColor =
              typeLower === "client"
                ? "#E5C07B"
                : typeLower === "service"
                ? "#E8E4D9"
                : typeLower === "worker"
                ? "var(--sun)"
                : typeLower === "storage"
                ? "#FF6B6B"
                : "var(--muted)";

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x - BOX_W / 2}, ${
                  pos.y - BOX_H / 2
                })`}
                onPointerDown={(e) => handlePointerDown(node.id, e)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="group cursor-grab active:cursor-grabbing select-none"
                style={{ touchAction: "none" }}
              >
                {/* Node Box Rectangle */}
                <rect
                  width={BOX_W}
                  height={BOX_H}
                  fill="#0D0D0C"
                  stroke={
                    isDragging || isHovered
                      ? "var(--sun)"
                      : "rgba(255, 255, 255, 0.16)"
                  }
                  strokeWidth={isDragging || isHovered ? 1.6 : 1}
                  rx="3"
                  className="transition-colors duration-150"
                  style={{
                    filter:
                      isDragging || isHovered
                        ? "drop-shadow(0 0 10px rgba(255, 132, 56, 0.25))"
                        : "none",
                  }}
                />

                {/* Status Dot */}
                <circle
                  cx="14"
                  cy="17"
                  r="3"
                  fill={accentColor}
                  className={isHovered ? "animate-ping" : ""}
                />
                <circle
                  cx="14"
                  cy="17"
                  r="3"
                  fill={accentColor}
                />

                {/* Node Type Badge */}
                <text
                  x="24"
                  y="19"
                  fill="var(--muted)"
                  fontSize="8.5"
                  fontFamily="monospace"
                  className="uppercase tracking-widest font-semibold"
                >
                  {node.type || "NODE"}
                </text>

                {/* Node Title Label */}
                <text
                  x="14"
                  y="40"
                  fill="var(--bone)"
                  fontSize={node.label.length > 24 ? "9.5" : "10.5"}
                  fontFamily="monospace"
                  fontWeight="600"
                  className="select-none tracking-tight"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Layer 3: Edge Labels (Always rendered ON TOP so text is NEVER clipped by boxes) */}
        <g id="diagram-edge-labels">
          {edges.map((edge, idx) => {
            if (!edge.label) return null;
            const fromPos = positions[edge.from];
            const toPos = positions[edge.to];
            if (!fromPos || !toPos) return null;

            const isRelated =
              hoveredNodeId === null ||
              hoveredNodeId === edge.from ||
              hoveredNodeId === edge.to;
            const isHighlighted =
              hoveredNodeId !== null &&
              (hoveredNodeId === edge.from || hoveredNodeId === edge.to);

            const curve = getEdgeCurve(fromPos, toPos);
            const pillWidth = Math.max(70, edge.label.length * 6.6 + 18);

            return (
              <g
                key={`label-${idx}`}
                className="select-none pointer-events-none transition-opacity duration-200"
                style={{ opacity: isRelated ? 1 : 0.25 }}
              >
                {/* Backing pill plate blocks line behind text */}
                <rect
                  x={curve.midX - pillWidth / 2}
                  y={curve.midY - 10}
                  width={pillWidth}
                  height={20}
                  rx="3"
                  fill="#0A0A09"
                  stroke={
                    isHighlighted
                      ? "var(--sun)"
                      : "rgba(255, 255, 255, 0.18)"
                  }
                  strokeWidth="1"
                />
                <text
                  x={curve.midX}
                  y={curve.midY + 3.5}
                  fill={isHighlighted ? "var(--sun)" : "var(--bone)"}
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="500"
                  textAnchor="middle"
                  className="tracking-wider uppercase select-none"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <>
      {/* Inline Embedded Card */}
      <div
        className={cn(
          "relative w-full border border-rule bg-surface/50 p-4 sm:p-6 select-none group",
          className
        )}
      >
        {/* Header HUD */}
        <div className="font-mono text-[10px] tracking-dossier uppercase text-muted mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-rule/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sun animate-pulse" />
            <span className="text-bone font-semibold">
              SYSTEM ARCHITECTURE TOPOLOGY
            </span>
            <span className="text-muted hidden sm:inline">
              // DIRECTED GRAPH
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetLayout}
              className="px-2 py-0.5 text-[9px] font-mono text-muted hover:text-bone border border-rule hover:border-muted bg-bg/50 transition-colors"
              title="Reset layout positions"
            >
              ↺ RESET
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-sun border border-sun/50 bg-sun/10 hover:bg-sun/20 hover:border-sun transition-all cursor-pointer font-bold shadow-sm"
            >
              <span>⤢ EXPAND & INTERACT</span>
            </button>
          </div>
        </div>

        {/* Scrollable / Interactive Canvas */}
        <div
          className="relative w-full overflow-x-auto overflow-y-hidden cursor-crosshair rounded bg-bg/70 border border-rule/40 p-2"
          onDoubleClick={() => setIsExpanded(true)}
          title="Drag nodes to rearrange flow. Double-click or tap 'Expand' for fullscreen workspace."
        >
          {renderSvgContent(false)}
        </div>

        {/* Tactical Footer Cue */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted/70">
          <span className="hidden sm:inline">
            [TIP] DRAG ANY NODE TO RE-ROUTE TOPOLOGY // REAL-TIME PATH RECALCULATION
          </span>
          <span className="text-sun/90 ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sun" />
            CLICK &quot;EXPAND &amp; INTERACT&quot; FOR FULLSCREEN CANVAS
          </span>
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 bg-[#090908]/96 backdrop-blur-xl flex flex-col p-4 sm:p-6 md:p-8 select-none overflow-hidden animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Header HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 mb-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sun animate-pulse" />
              <div>
                <h3 className="font-bold uppercase tracking-dossier text-bone text-sm">
                  SYSTEM ARCHITECTURE TOPOLOGY // DIRECTED GRAPH
                </h3>
                <span className="text-[10px] text-muted tracking-wide">
                  LIVE INTERACTIVE WORKSPACE — DRAG NODES FREELY // ARROWS RE-ROUTE AT 60 FPS
                </span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-rule bg-surface/80 rounded">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
                  className="px-2.5 py-1 text-bone hover:text-sun hover:bg-white/5 border-r border-rule text-xs transition-colors"
                  title="Zoom Out"
                >
                  ―
                </button>
                <span className="px-2.5 py-1 text-[10px] text-muted font-mono select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
                  className="px-2.5 py-1 text-bone hover:text-sun hover:bg-white/5 text-xs transition-colors"
                  title="Zoom In"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={resetLayout}
                className="px-3 py-1 text-[11px] font-mono text-muted hover:text-bone border border-rule hover:border-muted bg-surface/80 transition-colors uppercase"
              >
                ↺ RESET LAYOUT
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-3 py-1 text-[11px] font-mono text-sun border border-sun/60 bg-sun/10 hover:bg-sun/25 hover:border-sun transition-all uppercase font-semibold ml-2"
                title="Close Lightbox (ESC)"
              >
                ✕ CLOSE [ESC]
              </button>
            </div>
          </div>

          {/* Modal Main Interactive Stage */}
          <div className="relative flex-1 w-full overflow-auto flex items-center justify-center p-2 bg-[#060605] border border-rule/60 rounded">
            <div className="w-full max-w-full overflow-auto flex items-center justify-center">
              {renderSvgContent(true)}
            </div>
          </div>

          {/* Modal Footer HUD */}
          <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-muted border-t border-rule/50 pt-2.5">
            <span className="text-sun">
              ● TOPOLOGY ROUTER: BOUNDARY RAY-BOX SPLINES ACTIVE
            </span>
            <span className="text-muted">
              PRESS [ESC] OR CLICK CLOSE TO RETURN TO CASE STUDY
            </span>
          </div>
        </div>
      )}
    </>
  );
}
