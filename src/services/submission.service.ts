/**
 * Submission upload — 3 langkah sesuai panduan backend:
 *
 * Step 1: POST /api/submissions/request-url (via proxy)
 *   Body: { requirement_id, file_path? }
 *   Response: { presignedUrl, filePath? }  — URL untuk PUT ke R2 + storage path
 *
 * Step 2: PUT presignedUrl — upload file binary ke R2.
 *   Di frontend lewat proxy /api/upload/put agar tidak kena CORS.
 *
 * Step 3: POST /api/submissions (via proxy) — konfirmasi
 *   Body: { requirement_id, file_path }  (file_path dari Step 1 response / client-generated)
 *   Backend verifikasi file di R2 (HeadObject) lalu simpan submission record.
 */

import { SignResponse } from "./upload.service";

function getContentType(file: File): string {
  return file.type || "application/octet-stream";
}

/**
 * Generate storage key unik untuk file submission.
 * Format: submissions/{teamId}/{requirementId}/{filename}
 */
function generateFilePath(teamId: string, requirementId: string, file: File): string {
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `submissions/${teamId}/${requirementId}/${sanitized}`;
}

export interface SubmitFileResult {
  /** Storage key/path — gunakan bersama PUBLIC_ASSET_URL untuk preview. */
  filePath: string;
}

/**
 * Submit satu file: 1× POST sign → 1× PUT → 1× POST confirm.
 * Mengembalikan { filePath } agar caller bisa menyimpan referensi untuk preview.
 */
export async function submitFile(
  teamId: string,
  requirementId: string,
  file: File
): Promise<SubmitFileResult> {
  if (!requirementId) {
    throw new Error("requirement_id belum dikonfigurasi. Isi NEXT_PUBLIC_REQ_* di .env");
  }
  if (!teamId) {
    throw new Error("teamId tidak tersedia. Pastikan sudah login dan profil tim telah dibuat.");
  }

  const contentType = getContentType(file);

  // Step 1: Sign — dapatkan presigned URL dari backend
  const clientFilePath = generateFilePath(teamId, requirementId, file);
  const signRes = await fetch("/api/submissions/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      requirement_id: requirementId,
      file_path: clientFilePath,
      filename: file.name,
      content_type: contentType,
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

  // Gunakan file_path dari server (diharapkan backend mengembalikannya).
  // Fallback ke client-generated path jika backend tidak mengembalikannya.
  const confirmedFilePath =
    signData.filePath ??
    signData.file_path ??
    signData.path ??
    signData.key ??
    clientFilePath; // fallback ke client-generated jika backend tidak mengembalikan file_path

  if (typeof window !== "undefined") {
    console.log("[submission] sign", {
      requirementId,
      confirmedFilePath,
      presignedUrl: presignedUrl ? presignedUrl.slice(0, 80) + "…" : undefined,
      rawSignData: signData,
    });
  }

  if (!presignedUrl) {
    throw new Error("Invalid sign response: missing presignedUrl");
  }

  // Step 2: PUT via proxy agar tidak kena CORS
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
    console.log("[submission] PUT", {
      requirementId,
      confirmedFilePath,
      status: putRes.status,
      ok: putRes.ok,
    });
  }

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    const msg = (errData as { error?: string }).error || `Upload failed: ${putRes.status}`;
    throw new Error(msg);
  }

  // Step 3: Confirm — gunakan confirmedFilePath (dari server) bukan client-generated
  const confirmRes = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      requirement_id: requirementId,
      file_path: confirmedFilePath,
    }),
  });

  if (typeof window !== "undefined") {
    const confirmData = await confirmRes.clone().json().catch(() => ({}));
    console.log("[submission] confirm", {
      requirementId,
      confirmedFilePath,
      status: confirmRes.status,
      ok: confirmRes.ok,
      responseData: confirmData,
    });
  }

  if (!confirmRes.ok) {
    const err = await confirmRes.text();
    throw new Error(err || `Confirm failed: ${confirmRes.status}`);
  }

  return { filePath: confirmedFilePath };
}

export interface SubmitResult {
  requirementId: string;
  fileName: string;
  success: boolean;
  filePath?: string;
  error?: string;
}

/**
 * Submit banyak file secara paralel — setiap file mendapat siklus sendiri (Sign → PUT → Confirm).
 * Mengembalikan hasil per file (success/error).
 */
export async function submitFiles(
  teamId: string,
  items: { requirementId: string; file: File }[],
  onProgress?: (
    requirementId: string,
    status: "uploading" | "done" | "error",
    error?: string
  ) => void
): Promise<SubmitResult[]> {
  const settled = await Promise.allSettled(
    items.map(async ({ requirementId, file }) => {
      if (typeof window !== "undefined") {
        console.log(`[submission] start: ${requirementId} (${file.name})`);
      }
      onProgress?.(requirementId, "uploading");
      const { filePath } = await submitFile(teamId, requirementId, file);
      onProgress?.(requirementId, "done");
      return { requirementId, fileName: file.name, filePath };
    })
  );

  return settled.map((result, i) => {
    const { requirementId, file } = items[i];
    if (result.status === "fulfilled") {
      return {
        requirementId,
        fileName: file.name,
        filePath: result.value.filePath,
        success: true,
      };
    }
    const error =
      result.reason instanceof Error ? result.reason.message : String(result.reason);
    onProgress?.(requirementId, "error", error);
    return { requirementId, fileName: file.name, success: false, error };
  });
}
