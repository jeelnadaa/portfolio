import { cn } from "@/lib/utils";

interface RuleProps {
  className?: string;
  vertical?: boolean;
}

export function Rule({ className, vertical = false }: RuleProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        vertical
          ? "w-[1px] h-full bg-rule self-stretch shrink-0"
          : "h-[1px] w-full bg-rule block shrink-0",
        className
      )}
    />
  );
}
