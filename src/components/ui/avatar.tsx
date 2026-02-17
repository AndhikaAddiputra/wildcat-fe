import { forwardRef, type ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg";
  fallback?: string;
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", fallback, src, alt, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-14 w-14 text-base",
    };

    if (!src && fallback) {
      return (
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-zinc-200 font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300",
            sizeClasses[size],
            className
          )}
        >
          {fallback}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          "inline-block rounded-full object-cover",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
