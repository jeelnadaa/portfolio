import React from "react";
import type { Project } from "@/lib/schema";
import { Diagram } from "@/components/project/Diagram";

interface ProjectNarrativeProps {
  project: Project;
}

interface OrderedListData {
  type: "ordered-list";
  items: string[];
}

interface UnorderedListData {
  type: "unordered-list";
  items: string[];
}

interface ParagraphData {
  type: "paragraph";
  text: string;
}

type NarrativeBlock = OrderedListData | UnorderedListData | ParagraphData;

interface NarrativeSection {
  title: string;
  blocks: NarrativeBlock[];
}


function renderInline(text: string): React.ReactNode {
  if (!text) return null;

  // Regex matching **bold**, *italic*, `code`, and [link](url)
  const regex = /(\*\*[\s\S]*?\*\*|\*[^\s*][\s\S]*?\*|\[.*?\]\(.*?\)|\`[^\`]+\`)/g;
  const parts = text.split(regex);

  return parts.filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="text-bone font-semibold">
          {renderInline(part.slice(2, -2))}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return (
        <em key={i} className="text-bone/90 italic">
          {renderInline(part.slice(1, -1))}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={i}
          className="font-mono text-xs px-1.5 py-0.5 bg-surface text-sun border border-rule/60 rounded"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("[") && part.includes("](")) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sun hover:underline underline-offset-4"
          >
            {match[1]}
          </a>
        );
      }
    }
    return part;
  });
}

function parseBlocks(markdown: string): NarrativeBlock[] {
  const blocks: NarrativeBlock[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // Code block: deliberately skipped so we do not display isolated code snippets
    if (line.trim().startsWith("```")) {
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        i++;
      }
      i++; // skip closing ```
      continue;
    }

    // Ordered list (e.g. "1. Item...")
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        // Skip blank lines if next line is also a numbered item
        let nextI = i;
        while (nextI < lines.length && !lines[nextI].trim()) {
          nextI++;
        }
        if (nextI < lines.length && /^\s*\d+\.\s+/.test(lines[nextI])) {
          i = nextI;
        } else if (items.length > 0) {
          break;
        }

        const itemLine = lines[i];
        const match = itemLine.match(/^\s*\d+\.\s+(.*)$/);
        if (match) {
          let itemText = match[1];
          i++;
          // collect sub-lines or nested bullets until next ordered item or code block or heading
          while (
            i < lines.length &&
            !lines[i].trim().startsWith("```") &&
            !lines[i].trim().startsWith("## ")
          ) {
            if (!lines[i].trim()) {
              let lookahead = i + 1;
              while (lookahead < lines.length && !lines[lookahead].trim()) lookahead++;
              if (
                lookahead < lines.length &&
                (/^\s*\d+\.\s+/.test(lines[lookahead]) ||
                  lines[lookahead].trim().startsWith("```") ||
                  lines[lookahead].trim().startsWith("## "))
              ) {
                break;
              }
            }
            if (/^\s*\d+\.\s+/.test(lines[i])) break;
            itemText += "\n" + lines[i];
            i++;
          }
          items.push(itemText.trim());
        } else {
          break;
        }
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // Unordered list (e.g. "- Item...")
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length) {
        let nextI = i;
        while (nextI < lines.length && !lines[nextI].trim()) {
          nextI++;
        }
        if (nextI < lines.length && /^\s*[-*]\s+/.test(lines[nextI])) {
          i = nextI;
        } else if (items.length > 0) {
          break;
        }

        const itemLine = lines[i];
        const match = itemLine.match(/^\s*[-*]\s+(.*)$/);
        if (match) {
          let itemText = match[1];
          i++;
          while (
            i < lines.length &&
            !lines[i].trim().startsWith("```") &&
            !lines[i].trim().startsWith("## ")
          ) {
            if (!lines[i].trim()) {
              let lookahead = i + 1;
              while (lookahead < lines.length && !lines[lookahead].trim()) lookahead++;
              if (
                lookahead < lines.length &&
                (/^\s*[-*]\s+/.test(lines[lookahead]) ||
                  lines[lookahead].trim().startsWith("```") ||
                  lines[lookahead].trim().startsWith("## "))
              ) {
                break;
              }
            }
            if (/^\s*[-*]\s+/.test(lines[i])) break;
            itemText += "\n" + lines[i];
            i++;
          }
          items.push(itemText.trim());
        } else {
          break;
        }
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    // Regular paragraph
    let paraText = line.trim();
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !lines[i].trim().startsWith("## ")
    ) {
      paraText += " " + lines[i].trim();
      i++;
    }
    blocks.push({ type: "paragraph", text: paraText });
  }

  return blocks;
}

function parseSections(content: string): NarrativeSection[] {
  if (!content) return [];
  const lines = content.split("\n");
  const sections: NarrativeSection[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      if (currentTitle || currentLines.length > 0) {
        const body = currentLines.join("\n").trim();
        if (body || currentTitle) {
          sections.push({
            title: currentTitle || "00 // OVERVIEW",
            blocks: parseBlocks(body),
          });
        }
      }
      currentTitle = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }

  if (currentTitle || currentLines.length > 0) {
    const body = currentLines.join("\n").trim();
    if (body || currentTitle) {
      sections.push({
        title: currentTitle || "00 // OVERVIEW",
        blocks: parseBlocks(body),
      });
    }
  }

  return sections;
}

export function ProjectNarrative({ project }: ProjectNarrativeProps) {
  const sections = parseSections(project.content);

  // If no sections were parsed from markdown, fall back gracefully
  if (sections.length === 0) {
    return (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-rule pb-10">
          <div className="md:col-span-4 font-mono text-xs uppercase tracking-dossier text-muted">
            01 // ARCHITECTURE & OVERVIEW
          </div>
          <div className="md:col-span-8 space-y-6">
            <p className="font-sans text-sm sm:text-base text-bone/80 leading-relaxed">
              {project.summary}
            </p>
            {project.architecture && (
              <Diagram
                nodes={project.architecture.nodes}
                edges={project.architecture.edges}
                projectSlug={project.slug}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sections.map((section, idx) => {
        const isBuildSection =
          section.title.toUpperCase().includes("BUILD") ||
          section.title.startsWith("03");

        return (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-rule pb-10"
          >
            {/* Left Header */}
            <div className="md:col-span-4 font-mono text-xs uppercase tracking-dossier text-muted">
              {section.title}
            </div>

            {/* Right Narrative Body */}
            <div className="md:col-span-8 space-y-6 font-sans text-sm sm:text-base text-bone/80 leading-relaxed">
              {section.blocks.map((block, bIdx) => {
                if (block.type === "paragraph") {
                  return (
                    <p key={bIdx} className="leading-relaxed">
                      {renderInline(block.text)}
                    </p>
                  );
                }

                if (block.type === "ordered-list") {
                  return (
                    <ol key={bIdx} className="space-y-4 list-none pl-0">
                      {block.items.map((item, itemIdx) => {
                        const [firstLine, ...nestedLines] = item.split("\n");
                        const subBullets = nestedLines
                          .map((l) => l.trim())
                          .filter((l) => l.startsWith("-") || l.startsWith("*"))
                          .map((l) => l.replace(/^[-*]\s+/, ""));
                        const otherLines = nestedLines
                          .map((l) => l.trim())
                          .filter(
                            (l) => !l.startsWith("-") && !l.startsWith("*") && l.length > 0
                          );

                        return (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <span className="font-mono text-xs text-sun font-bold shrink-0 pt-0.5 select-none">
                              0{itemIdx + 1}.
                            </span>
                            <div className="space-y-2 flex-1">
                              <div>{renderInline(firstLine)}</div>
                              {otherLines.length > 0 && (
                                <div className="text-bone/75 space-y-1">
                                  {otherLines.map((l, oIdx) => (
                                    <div key={oIdx}>{renderInline(l)}</div>
                                  ))}
                                </div>
                              )}
                              {subBullets.length > 0 && (
                                <ul className="pl-4 pt-1 space-y-1.5 border-l border-rule/50 mt-2 list-none">
                                  {subBullets.map((sub, sIdx) => (
                                    <li
                                      key={sIdx}
                                      className="flex items-start gap-2 text-xs sm:text-sm text-bone/70"
                                    >
                                      <span className="text-sun font-mono text-[10px] mt-0.5 select-none">
                                        ▸
                                      </span>
                                      <span>{renderInline(sub)}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  );
                }

                if (block.type === "unordered-list") {
                  return (
                    <ul key={bIdx} className="space-y-3 list-none pl-0">
                      {block.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3">
                          <span className="text-sun font-mono text-xs select-none mt-1 shrink-0">
                            ―
                          </span>
                          <div className="flex-1">{renderInline(item)}</div>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return null;
              })}

              {/* Render architecture diagram in BUILD section if available */}
              {isBuildSection && project.architecture && (
                <div className="pt-2">
                  <Diagram
                    nodes={project.architecture.nodes}
                    edges={project.architecture.edges}
                    projectSlug={project.slug}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
