import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "sun" | "kbd";
}

export function Tag({ children, className, variant = "default" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs tracking-dossier uppercase px-2.5 py-0.5 border border-rule transition-colors",
        variant === "default" && "text-muted border-rule hover:border-bone/40 hover:text-bone",
        variant === "sun" && "text-sun border-sun/40 bg-sun/5",
        variant === "kbd" && "text-bone/80 border-rule px-1.5 py-0.5 rounded-sharp text-xs",
        className
      )}
    >
      {children}
    </span>
  );
}
