/**
 * File upload via backend sign → PUT presigned URL → confirm.
 * Set NEXT_PUBLIC_API_URL to your backend base (e.g. https://api.example.com).
 */

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

function getContentType(file: File): string {
  return file.type || "application/octet-stream";
}

export interface SignResponse {
  presignedUrl?: string;
  url?: string;
  filePath: string;
}

/**
 * 1. POST /sign → get presigned URL and filePath
 * 2. PUT to presigned URL with file body
 * 3. POST /confirm with filePath
 */
export async function uploadFile(
  teamId: string,
  documentType: string,
  file: File
): Promise<void> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set. Configure it in .env.local.");
  }

  const contentType = getContentType(file);
  const fileName = file.name;

  const signRes = await fetch(`${baseUrl}/sign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teamId,
      documentType,
      contentType,
      fileName,
    }),
  });

  if (!signRes.ok) {
    const err = await signRes.text();
    throw new Error(err || `Sign failed: ${signRes.status}`);
  }

  const signData = (await signRes.json()) as SignResponse;
  const presignedUrl = signData.presignedUrl ?? signData.url;
  const filePath = signData.filePath;

  if (!presignedUrl || !filePath) {
    throw new Error("Invalid sign response: missing presignedUrl or filePath");
  }

  const putRes = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`Upload failed: ${putRes.status}`);
  }

  const confirmRes = await fetch(`${baseUrl}/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teamId,
      documentType,
      filePath,
    }),
  });

  if (!confirmRes.ok) {
    const err = await confirmRes.text();
    throw new Error(err || `Confirm failed: ${confirmRes.status}`);
  }
}

/**
 * Upload multiple files sequentially. Fails on first error.
 */
export async function uploadFiles(
  teamId: string,
  items: { documentType: string; file: File }[]
): Promise<void> {
  for (const { documentType, file } of items) {
    await uploadFile(teamId, documentType, file);
  }
}
