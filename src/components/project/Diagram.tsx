"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMedia";
import { cn } from "@/lib/utils";

interface DiagramNode {
  id: string;
  label: string;
  type?: string;
}

interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

interface DiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  className?: string;
}

export function Diagram({ nodes, edges, className }: DiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Simple layout computation across a 4-column flow
  const nodePositions = nodes.map((n, idx) => ({
    ...n,
    x: 80 + (idx % 4) * 200,
    y: 80 + Math.floor(idx / 4) * 120,
  }));

  useEffect(() => {
    if (prefersReduced) return;
    const container = containerRef.current;
    if (!container) return;

    const edgeLines = container.querySelectorAll(".diagram-edge-line");
    const nodeBoxes = container.querySelectorAll(".diagram-node-box");

    gsap.fromTo(
      edgeLines,
      { strokeDashoffset: 300, strokeDasharray: 300 },
      {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      nodeBoxes,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.4)",
        stagger: 0.1,
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        },
      }
    );
  }, [prefersReduced]);

  const svgWidth = Math.max(680, nodes.length * 170);
  const svgHeight = Math.max(220, Math.ceil(nodes.length / 4) * 140);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-x-auto border border-rule bg-surface/50 p-6 select-none",
        className
      )}
    >
      <div className="font-mono text-[10px] tracking-dossier uppercase text-muted mb-4 flex items-center justify-between">
        <span>SYSTEM ARCHITECTURE TOPOLOGY</span>
        <span className="text-sun">DIRECTED GRAPH // FLOW</span>
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto min-w-[580px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 7 3.5, 0 7" fill="var(--bone)" opacity="0.6" />
          </marker>
        </defs>

        {/* Edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodePositions.find((n) => n.id === edge.from);
          const toNode = nodePositions.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const startX = fromNode.x + 60;
          const startY = fromNode.y + 24;
          const endX = toNode.x - 10;
          const endY = toNode.y + 24;

          return (
            <g key={`edge-${idx}`}>
              <path
                d={`M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 40} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="var(--bone)"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
                className="diagram-edge-line"
              />
              {edge.label && (
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 8}
                  fill="var(--muted)"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="uppercase tracking-widest"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodePositions.map((node) => (
          <g
            key={node.id}
            transform={`translate(${node.x - 50}, ${node.y})`}
            className="diagram-node-box group cursor-default"
          >
            <rect
              width="120"
              height="48"
              fill="var(--bg)"
              stroke="var(--rule)"
              strokeWidth="1"
              rx="1"
              className="group-hover:stroke-sun group-hover:fill-surface transition-colors"
            />
            <circle
              cx="12"
              cy="16"
              r="3"
              fill="var(--sun)"
              className="animate-pulse"
            />
            <text
              x="22"
              y="18"
              fill="var(--muted)"
              fontSize="8"
              fontFamily="monospace"
              className="uppercase tracking-widest"
            >
              {node.type || "NODE"}
            </text>
            <text
              x="12"
              y="34"
              fill="var(--bone)"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
