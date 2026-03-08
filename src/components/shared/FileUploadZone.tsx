"use client";

import { useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const DEFAULT_ACCEPT = ".jpg,.jpeg,.png,.pdf";
const DEFAULT_MAX_MB = 5;

export interface FileUploadZoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
  zoneClassName?: string;
}

export function FileUploadZone({
  value,
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSizeMb = DEFAULT_MAX_MB,
  disabled = false,
  className,
  zoneClassName,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxBytes = maxSizeMb * 1024 * 1024;

  const validateAndSet = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        return;
      }
      if (file.size > maxBytes) {
        alert(`File must be under ${maxSizeMb} MB.`);
        return;
      }
      onChange(file);
    },
    [onChange, maxBytes, maxSizeMb]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    validateAndSet(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const f = e.dataTransfer.files?.[0] ?? null;
    validateAndSet(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
  };

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3 justify-center items-center p-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden
      />
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        className={cn(
          "min-h-[240px] sm:min-h-[280px] lg:min-h-[300px] w-full border-4 border-dashed border-navy rounded-[20px] flex flex-col gap-2 sm:gap-3 justify-center items-center cursor-pointer transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2",
          value && "border-green-600 bg-green-50/50",
          zoneClassName
        )}
      >
        {value ? (
          <>
            <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center text-navy break-all px-2">
              {value.name}
            </span>
            <span className="text-sm text-navy/80">
              {(value.size / 1024).toFixed(1)} KB
            </span>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="text-navy border-navy"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              Remove
            </Button>
          </>
        ) : (
          <>
            <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center">
              Drag and drop your files
            </span>
            <span className="font-medium text-sm sm:text-[20px] text-center">
              JPG, PNG, or PDF, up to {maxSizeMb} MB
            </span>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="text-navy border-navy"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Select File
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
