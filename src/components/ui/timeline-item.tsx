import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TimelineItemProps {
  icon?: ReactNode;
  label: string;
  className?: string;
}

function TimelineItem({ icon, label, className }: TimelineItemProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-orange">
        {icon}
      </div>
      <span className="text-center text-sm font-semibold text-cream">
        {label}
      </span>
    </div>
  );
}

export { TimelineItem };
