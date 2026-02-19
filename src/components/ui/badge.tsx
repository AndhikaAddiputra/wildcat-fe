import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "pending-s" | "verified-s" | "complete-s" | "pending" | "verified" | "complete" | "end";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "items-center border-3 rounded-[20px] h-[40px] w-[147px] px-2.5 py-0.5 text-[16px] font-bold transition-colors bg-darkblue flex justify-center before:content-[''] before:mr-2 before:w-2 before:h-2 before:rounded-full before:bg-current",
        {
          "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300":
            variant === "default",
          "text-yellow border-yellow":
            variant === "pending-s",
          "text-orange border-orange":
            variant === "verified-s",
          "text-green border-green":
            variant === "complete-s",
          "text-yellow border-yellow w-[200px]":
            variant === "pending",
          "text-orange border-orange w-[200px]":
            variant === "verified",
          "text-green border-green w-[200px]":
            variant === "complete",
          "text-red border-red w-[200px]":
            variant === "end",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
