import { cn } from "@/lib/utils";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <div
      role="separator"
      className={cn(
        "shrink-0 bg-zinc-200 dark:bg-zinc-800",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}

export { Separator };
