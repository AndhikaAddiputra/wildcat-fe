import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-[#f6911e] text-[#0a2d6e] hover:bg-[#e08000] dark:bg-[#f6911e] dark:hover:bg-[#e08000]":
              variant === "primary",
            "bg-[#0a2d6e] text-white hover:bg-[#082255] dark:bg-[#0a2d6e] dark:hover:bg-[#082255]":
              variant === "secondary",
            "border-3 border-[#f1e1b4] bg-white/10 text-[#f1e1b4] dark:bg-white/10 dark:border-[#f1e1b4] dark:text-[#f1e1b4]":
              variant === "outline",
            "bg-transparent text-[#f1e1b4] hover:text-[#f6911e] dark:text-[#f1e1b4]":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700":
              variant === "danger",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
