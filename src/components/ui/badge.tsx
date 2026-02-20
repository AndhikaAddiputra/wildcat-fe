import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "kuning" | "orange" | "hijau";
}

function Badge({ className, variant = "orange", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold",
        {
          "bg-[#FFCC00]/20 text-[#FFCC00]": variant === "kuning",
          "bg-[#FF8D28]/20 text-[#FF8D28]": variant === "orange",
          "bg-[#34C759]/20 text-[#34C759]": variant === "hijau",
        },
        className
      )}
      {...props}
    >
      <span
        className={cn("h-2.5 w-2.5 shrink-0 rounded-full", {
          "bg-[#FFCC00]": variant === "kuning",
          "bg-[#FF8D28]": variant === "orange",
          "bg-[#34C759]": variant === "hijau",
        })}
      />
      {children}
    </span>
  );
}

export { Badge };
