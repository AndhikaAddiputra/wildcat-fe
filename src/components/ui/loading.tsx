"use client";

import { cn } from "@/lib/utils";

// ─── Spinner sizes ────────────────────────────────────────────────────────────

const SIZES = {
  xs: { outer: "h-4 w-4", border: "border-2", inner: "inset-[3px]" },
  sm: { outer: "h-6 w-6", border: "border-2", inner: "inset-[4px]" },
  md: { outer: "h-9 w-9", border: "border-[3px]", inner: "inset-[5px]" },
  lg: { outer: "h-14 w-14", border: "border-4", inner: "inset-[7px]" },
  xl: { outer: "h-20 w-20", border: "border-[5px]", inner: "inset-[9px]" },
} as const;

type SpinnerSize = keyof typeof SIZES;

// ─── Spinner ──────────────────────────────────────────────────────────────────

export interface SpinnerProps {
  /** Ukuran spinner. Default: "md" */
  size?: SpinnerSize;
  className?: string;
  /** Label aksesibilitas. Default: "Loading" */
  label?: string;
}

/**
 * Double-ring spinner berdasarkan brand colors:
 * - Ring luar: orange (#f6911e), berputar searah jarum jam
 * - Ring dalam: cream (#f1e1b4), berputar berlawanan arah
 */
export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  const s = SIZES[size];
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("relative inline-block shrink-0", s.outer, className)}
    >
      {/* Ring luar — orange, clockwise */}
      <span
        className={cn(
          "absolute inset-0 rounded-full border-transparent animate-spin",
          s.border,
          "border-t-[#f6911e] border-r-[#f6911e]"
        )}
      />
      {/* Ring dalam — cream, counter-clockwise */}
      <span
        className={cn(
          "absolute rounded-full border-transparent animate-spin-slow-reverse",
          s.border,
          s.inner,
          "border-b-[#f1e1b4] border-l-[#f1e1b4]"
        )}
      />
    </span>
  );
}

// ─── PageLoader ───────────────────────────────────────────────────────────────

export interface PageLoaderProps {
  /** Teks di bawah spinner. Default tidak ada teks. */
  text?: string;
  className?: string;
}

/**
 * Full-page overlay loading untuk initial page load atau navigasi antar halaman.
 * Letakkan sebagai pengganti konten halaman saat `loading === true`.
 */
export function PageLoader({ text, className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6",
        "bg-[#060f26]/80 backdrop-blur-sm",
        className
      )}
    >
      <Spinner size="xl" />
      {text && (
        <p className="text-[#f1e1b4] font-semibold text-base sm:text-lg text-center max-w-xs px-4 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// ─── LoadingOverlay ───────────────────────────────────────────────────────────

export interface LoadingOverlayProps {
  /** Tampilkan overlay atau tidak. */
  visible: boolean;
  /** Teks opsional di bawah spinner. */
  text?: string;
  /** Warna overlay. Default: navy semi-transparan. */
  overlayClassName?: string;
  className?: string;
}

/**
 * Overlay di atas section/card. Parent harus `relative`.
 * Gunakan untuk loading di area tertentu (bukan seluruh halaman).
 *
 * @example
 * <div className="relative">
 *   <CardLarge>...</CardLarge>
 *   <LoadingOverlay visible={loading} text="Loading..." />
 * </div>
 */
export function LoadingOverlay({
  visible,
  text,
  overlayClassName,
  className,
}: LoadingOverlayProps) {
  if (!visible) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 rounded-[20px]",
        "bg-[#0a2d6e]/75 backdrop-blur-[2px]",
        overlayClassName,
        className
      )}
    >
      <Spinner size="lg" />
      {text && (
        <p className="text-[#f1e1b4] font-semibold text-sm sm:text-base text-center max-w-[240px] px-4 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// ─── InlineLoader ─────────────────────────────────────────────────────────────

export interface InlineLoaderProps {
  text?: string;
  size?: SpinnerSize;
  className?: string;
}

/**
 * Spinner + teks dalam satu baris. Cocok untuk state loading di dalam card,
 * section, atau tepat di bawah header.
 */
export function InlineLoader({ text = "Loading...", size = "sm", className }: InlineLoaderProps) {
  return (
    <div className={cn("flex items-center gap-2 text-[#f1e1b4]/80", className)}>
      <Spinner size={size} />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
