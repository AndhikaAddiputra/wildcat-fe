/**
 * File upload — 3 langkah sesuai panduan backend:
 *
 * Step 1: POST $API_URL/sign
 *   Body: { teamId, documentType, fileName } — tanpa contentType
 *   Response: presigned URL + filePath
 *
 * Step 2: PUT THE_PRESIGNED_URL — tanggung jawab FE: PUT langsung ke signed URL (tanpa proxy).
 * Step 3: POST $API_URL/confirm
 *   Body: { teamId, documentType, filePath }
 *
 * Di frontend: Step 1 & 3 lewat Next.js (/api/upload/sign, /api/upload/confirm) yang proxy ke backend dengan Bearer token.
 */

function getUploadApiBase(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3030";
}

function getContentType(file: File): string {
  return file.type || "application/octet-stream";
}

export interface SignResponse {
  /** URL untuk PUT file (Step 2) — backend bisa pakai presignedUrl, url, presigned_url, uploadUrl, dll. */
  presignedUrl?: string;
  url?: string;
  presigned_url?: string;
  uploadUrl?: string;
  upload_url?: string;
  signedUrl?: string;
  /** Path untuk Step 3 confirm — backend bisa pakai filePath, file_path, path, key */
  filePath?: string;
  file_path?: string;
  path?: string;
  key?: string;
}

export interface UploadFileResult {
  filePath: string;
}

/**
 * Satu file: 1× POST sign → 1× PUT → 1× POST confirm.
 * Presigned URL bersifat 1-to-1 (satu URL untuk satu file), jadi untuk banyak file panggil uploadFile sekali per file via uploadFiles().
 * Mengembalikan { filePath } agar caller bisa menyimpan referensi untuk preview.
 */
export async function uploadFile(
  teamId: string,
  documentType: string,
  file: File
): Promise<UploadFileResult> {
  const baseUrl = getUploadApiBase().replace(/\/$/, "");
  const signPath = baseUrl ? `${baseUrl}/sign` : "/api/upload/sign";
  const confirmPath = baseUrl ? `${baseUrl}/confirm` : "/api/upload/confirm";

  const contentType = getContentType(file);
  const fileName = file.name;

  const signRes = await fetch(signPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      teamId,
      documentType,
      fileName,
      contentType,
    }),
  });

  if (!signRes.ok) {
    const err = await signRes.text();
    throw new Error(err || `Sign failed: ${signRes.status}`);
  }

  const signData = (await signRes.json()) as SignResponse;
  const presignedUrl =
    signData.presignedUrl ??
    signData.url ??
    signData.presigned_url ??
    signData.uploadUrl ??
    signData.upload_url ??
    signData.signedUrl;
  const filePath =
    signData.filePath ??
    signData.file_path ??
    signData.path ??
    signData.key;

  if (!presignedUrl || !filePath) {
    throw new Error("Invalid sign response: missing presignedUrl or filePath");
  }

  // Step 2: PUT via proxy (server → R2) agar tidak kena CORS saat browser → R2
  const formData = new FormData();
  formData.set("file", file);
  formData.set("presignedUrl", presignedUrl);
  formData.set("contentType", contentType);

  const putRes = await fetch("/api/upload/put", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (typeof window !== "undefined") {
    console.log("[upload] PUT", {
      documentType,
      fileName,
      status: putRes.status,
      ok: putRes.ok,
    });
  }
  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    const msg = (errData as { error?: string }).error || `Upload failed: ${putRes.status}`;
    throw new Error(msg);
  }

  // Step 3: POST confirm
  const confirmRes = await fetch(confirmPath, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      teamId,
      documentType,
      filePath,
    }),
  });

  if (typeof window !== "undefined") {
    const confirmData = await confirmRes.clone().json().catch(() => ({}));
    console.log("[upload] confirm", {
      documentType,
      filePath,
      status: confirmRes.status,
      ok: confirmRes.ok,
      responseData: confirmData,
    });
  }
  if (!confirmRes.ok) {
    const err = await confirmRes.text();
    throw new Error(err || `Confirm failed: ${confirmRes.status}`);
  }

  return { filePath };
}

export interface UploadResult {
  documentType: string;
  fileName: string;
  success: boolean;
  /** Path di storage — tersedia saat success: true. Gunakan bersama PUBLIC_ASSET_URL untuk preview. */
  filePath?: string;
  error?: string;
}

/**
 * Upload banyak file secara paralel: setiap file mendapat siklus sendiri (Sign → PUT → Confirm)
 * yang dijalankan bersamaan via Promise.allSettled.
 * Presigned URL 1-to-1 per file — N file = N× POST sign, N× PUT, N× POST confirm, semua parallel.
 * Mengembalikan hasil per file (success/error) alih-alih throw saat satu file gagal.
 */
export async function uploadFiles(
  teamId: string,
  items: { documentType: string; file: File }[],
  onProgress?: (documentType: string, status: "uploading" | "done" | "error", error?: string) => void
): Promise<UploadResult[]> {
  const settled = await Promise.allSettled(
    items.map(async ({ documentType, file }) => {
      if (typeof window !== "undefined") {
        console.log(`[upload] start: ${documentType} (${file.name})`);
      }
      onProgress?.(documentType, "uploading");
      const { filePath } = await uploadFile(teamId, documentType, file);
      onProgress?.(documentType, "done");
      return { documentType, fileName: file.name, filePath };
    })
  );

  return settled.map((result, i) => {
    const { documentType, file } = items[i];
    if (result.status === "fulfilled") {
      return {
        documentType,
        fileName: file.name,
        filePath: result.value.filePath,
        success: true,
      };
    }
    const error =
      result.reason instanceof Error ? result.reason.message : String(result.reason);
    onProgress?.(documentType, "error", error);
    return { documentType, fileName: file.name, success: false, error };
  });
}
