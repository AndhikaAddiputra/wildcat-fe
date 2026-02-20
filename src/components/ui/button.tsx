import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "primary-outline" | "secondary";
  size?: "lg" | "sm";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2.5 rounded-[20px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active":
              variant === "primary",
            "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 active:bg-primary/20":
              variant === "primary-outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active":
              variant === "secondary",
          },
          {
            "h-[70px] px-8 text-base": size === "lg",
            "h-[50px] px-6 text-sm": size === "sm",
          },
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {leftIcon && <span className="flex shrink-0 items-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex shrink-0 items-center">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
