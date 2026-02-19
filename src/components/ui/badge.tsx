import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "pending" | "verified" | "complete" | "end";
}

function Badge({ className, variant = "pending", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "items-center border-3 rounded-[20px] h-[40px] w-[160px] px-2.5 py-0.5 text-xs font-medium transition-colors bg-darkblue flex justify-center",
        {
          "text-yellow border-yellow":
            variant === "pending",
          "text-orange border-orange":
            variant === "verified",
          "text-green border-green":
            variant === "complete",
          "text-red border-red":
            variant === "end",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
