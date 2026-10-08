"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "typescript",
  filename,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("CODE COPIED ✓");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative my-6 border border-rule bg-surface/90 overflow-hidden font-mono text-xs select-text",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-rule px-4 py-2 bg-bg/60 select-none">
        <div className="flex items-center gap-2 text-[11px] text-muted tracking-dossier">
          <span className="w-2 h-2 rounded-full bg-rule" />
          <span className="text-bone/80 font-medium">{filename || `${language}.ts`}</span>
        </div>
        <button
          onClick={handleCopy}
          data-cursor="COPY"
          className="text-[10px] uppercase tracking-dossier text-muted hover:text-sun border border-rule px-2 py-0.5 transition-colors"
        >
          {copied ? "COPIED ✓" : "COPY CODE ↗"}
        </button>
      </div>

      {/* Code contents */}
      <pre className="p-4 overflow-x-auto text-bone/90 leading-relaxed font-mono text-xs selection:bg-sun selection:text-bg">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
