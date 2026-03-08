"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Plus, FileText, Eye, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const DEFAULT_ACCEPT = ".jpg,.jpeg,.png,.pdf";
const DEFAULT_MAX_MB = 5;

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf";
}

export interface FileUploadZoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  /** URL file yang sudah diupload sebelumnya (dari localStorage/backend). Ditampilkan saat value == null. */
  uploadedUrl?: string;
  /** Nama file yang sudah diupload sebelumnya. */
  uploadedFileName?: string;
  /** Dipanggil saat user menghapus file yang sudah diupload. */
  onClearUploaded?: () => void;
  /**
   * Callback untuk mendapatkan signed URL saat Preview diklik pada uploaded file.
   * Jika tidak disediakan, digunakan uploadedUrl langsung.
   * Dipanggil lazy — hanya saat user klik Preview, bukan saat render.
   */
  fetchSignedUrl?: () => Promise<string>;
  accept?: string;
  maxSizeMb?: number;
  disabled?: boolean;
  className?: string;
  zoneClassName?: string;
}

export function FileUploadZone({
  value,
  onChange,
  uploadedUrl,
  uploadedFileName,
  onClearUploaded,
  fetchSignedUrl,
  accept = DEFAULT_ACCEPT,
  maxSizeMb = DEFAULT_MAX_MB,
  disabled = false,
  className,
  zoneClassName,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxBytes = maxSizeMb * 1024 * 1024;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fetchingPreview, setFetchingPreview] = useState(false);

  // Mode "sudah diupload": tidak ada file baru tapi ada URL dari upload sebelumnya
  const isUploadedMode = !value && !!uploadedUrl;

  // Object URL untuk preview; di-revoke saat unmount atau file berubah
  useEffect(() => {
    if (!value) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const validateAndSet = useCallback(
    (file: File | null) => {
      if (!file) {
        onChange(null);
        return;
      }
      if (file.size > maxBytes) {
        toast.error(`Ukuran file maksimal ${maxSizeMb} MB.`);
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

  // Tutup modal preview dengan Escape
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [previewOpen]);

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
          isUploadedMode && "border-blue-500 bg-blue-50/30",
          zoneClassName
        )}
      >
        {/* State: sudah diupload sebelumnya (persisted) */}
        {isUploadedMode ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full flex-1 min-h-0 px-2">
            {/* Cek ekstensi dari fileName; fallback ke coba tampilkan sebagai gambar */}
            {uploadedUrl && !/\.pdf$/i.test(uploadedFileName ?? uploadedUrl) ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPreviewOpen(true); }}
                className="relative w-full max-w-[200px] max-h-[160px] rounded-xl overflow-hidden border-2 border-blue-400/50 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Preview uploaded image"
              >
                <img
                  src={uploadedUrl}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Jika gagal load sebagai gambar, sembunyikan dan tampilkan ikon file
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const parent = (e.currentTarget as HTMLImageElement).closest("button");
                    if (parent) parent.style.display = "none";
                  }}
                />
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 text-navy/80">
                <FileText className="h-14 w-14 text-blue-600" />
                <span className="text-xs font-medium">
                  {uploadedFileName?.split(".").pop()?.toUpperCase() ?? "FILE"}
                </span>
              </div>
            )}
            <span className="font-semibold text-base sm:text-lg text-center text-navy break-all px-2">
              {uploadedFileName ?? "Uploaded"}
            </span>
            <span className="text-xs text-blue-700 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
              ✓ Sudah diupload
            </span>
            <div className="flex flex-wrap gap-2 justify-center mt-1">
              <Button
                type="button"
                variant="outline"
                size="md"
                disabled={fetchingPreview}
                className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500 disabled:opacity-60"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (fetchSignedUrl) {
                    setFetchingPreview(true);
                    try {
                      const url = await fetchSignedUrl();
                      window.open(url, "_blank", "noopener,noreferrer");
                    } catch {
                      toast.error("Gagal membuka preview. Coba lagi.");
                    } finally {
                      setFetchingPreview(false);
                    }
                  } else {
                    window.open(uploadedUrl, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                {fetchingPreview ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                Preview
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Ganti
              </Button>
              {onClearUploaded && (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearUploaded();
                  }}
                >
                  Hapus
                </Button>
              )}
            </div>
            {/* Modal preview untuk uploaded image */}
            {previewOpen && uploadedUrl && typeof document !== "undefined" &&
              createPortal(
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Preview uploaded image"
                  onClick={() => setPreviewOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    aria-label="Tutup preview"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <img
                    src={uploadedUrl}
                    alt=""
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>,
                document.body
              )}
          </div>
        ) : value ? (
          <>
            {/* Thumbnail / ikon sesuai tipe file */}
            <div className="flex flex-col items-center justify-center gap-2 w-full flex-1 min-h-0">
              {previewUrl && isImageFile(value) ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreviewOpen(true); }}
                  className="relative w-full max-w-[200px] max-h-[160px] rounded-xl overflow-hidden border-2 border-navy/30 hover:border-navy focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2"
                  aria-label="Preview image"
                >
                  <img
                    src={previewUrl}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors">
                    <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 drop-shadow" />
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-navy/80">
                  <FileText className="h-14 w-14" />
                  <span className="text-xs font-medium">
                    {isPdfFile(value) ? "PDF" : value.type || "File"}
                  </span>
                </div>
              )}
              <span className="font-semibold text-base sm:text-lg md:text-[22px] text-center text-navy break-all px-2">
                {value.name}
              </span>
              <span className="text-sm text-navy/80">
                {(value.size / 1024).toFixed(1)} KB
              </span>
              <div className="flex flex-wrap gap-2 justify-center">
                {previewUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(previewUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
            {/* Modal preview full-size untuk gambar — di-portal ke body */}
            {previewOpen && previewUrl && value && isImageFile(value) && typeof document !== "undefined" &&
              createPortal(
                <div
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Preview image"
                  onClick={() => setPreviewOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setPreviewOpen(false)}
                    className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    aria-label="Tutup preview"
                  >
                    <X className="h-6 w-6" />
                  </button>
                  <img
                    src={previewUrl}
                    alt=""
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>,
                document.body
              )}
          </>
        ) : (
          <>
            <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="font-semibold text-base sm:text-lg md:text-[18px] text-center">
              Drag and drop your files
            </span>
            <span className="font-medium text-sm sm:text-[16px] text-center">
              JPG, PNG, or PDF, up to {maxSizeMb} MB
            </span>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="!border-2 !border-blue-600 !bg-blue-50 !text-blue-800 hover:!bg-blue-100 focus-visible:!ring-blue-500"
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
