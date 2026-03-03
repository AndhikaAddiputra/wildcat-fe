import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "pending" | "verified" | "complete" | "end";
}

const variantDotClass = {
  default: "",
  pending: "bg-yellow-400",
  verified: "bg-orange-400",
  complete: "bg-green-400",
  end: "bg-red-400",
} as const;

function Badge({ className, variant = "pending", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[40px] w-[160px] items-center justify-center gap-2 rounded-[20px] border-2 px-2.5 py-0.5 text-xs font-medium transition-colors bg-navy",
        {
          "border-zinc-400 text-zinc-400": variant === "default",
          "border-yellow-400 text-yellow-400": variant === "pending",
          "border-orange-400 text-orange-400": variant === "verified",
          "border-green-400 text-green-400": variant === "complete",
          "border-red-400 text-red-400": variant === "end",
        },
        className
      )}
      {...props}
    >
      {variantDotClass[variant] && (
        <span className={cn("h-2 w-2 shrink-0 rounded-full", variantDotClass[variant])} />
      )}
      {children}
    </span>
  );
}

export { Badge };
