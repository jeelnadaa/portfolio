import { cn } from "@/lib/utils";

interface AssetPlaceholderProps {
  name: string;
  className?: string;
  aspectRatio?: string;
}

export function AssetPlaceholder({
  name,
  className,
  aspectRatio = "aspect-[4/3]",
}: AssetPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative w-full border border-rule bg-surface/80 flex flex-col items-center justify-center overflow-hidden p-6 select-none",
        aspectRatio,
        className
      )}
    >
      {/* Bayer noise background */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--bone) 1px, transparent 0)",
          backgroundSize: "6px 6px",
        }}
      />
      <div className="relative z-10 text-center font-mono space-y-2">
        <div className="text-[10px] tracking-widest text-sun font-bold">
          [ MISSING RAW ASSET ]
        </div>
        <div className="text-xs tracking-dossier text-muted uppercase">
          ASSET PENDING // {name}
        </div>
      </div>
    </div>
  );
}
