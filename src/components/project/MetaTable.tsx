import { SpecRow } from "@/components/ui/SpecRow";
import { siteConfig } from "@/data/site";
import { type Project } from "@/lib/schema";

export function MetaTable({ project }: { project: Project }) {
  return (
    <div className="border border-rule bg-surface/50 p-6 space-y-1 my-6 font-mono select-none">
      <div className="text-xs tracking-dossier uppercase text-sun font-bold border-b border-rule pb-2 mb-3 flex items-center justify-between">
        <span>PROJECT METADATA DOSSIER</span>
        <span>INDEX // 0{project.order}</span>
      </div>

      <SpecRow label="ROLE" value={project.role} />
      <SpecRow label="YEAR" value={project.year} />
      <SpecRow label="DURATION" value={project.duration} />
      <SpecRow label="STACK" value={project.stack.slice(0, 4).join(", ")} />
      <SpecRow
        label="STATUS"
        value={project.status.toUpperCase()}
        valueClassName={project.status === "live" ? "text-sun" : "text-bone"}
      />
      <SpecRow
        label="AUTHOR"
        value={`${siteConfig.legalName} (${siteConfig.brand})`}
      />
    </div>
  );
}
