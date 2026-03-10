import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * POST /api/submissions/request-url
 * Proxy ke backend: POST $API_URL/api/submissions/request-url
 *
 * Sign step — dapatkan presigned URL untuk upload file ke R2.
 * Body: { requirement_id, file_path? }
 * Response: { presignedUrl / presigned_url, file_path? }
 */
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requirement_id, file_path, filename, content_type } = body as Record<
      string,
      string | undefined
    >;

    if (!requirement_id || !filename || !content_type) {
      return NextResponse.json(
        { error: "requirement_id, filename, and content_type are required" },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    const url = `${base}/api/submissions/request-url`;

    const requestBody: Record<string, string> = { requirement_id, filename, content_type };
    if (file_path) requestBody.file_path = file_path;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json().catch(() => ({}));

    console.log(
      "[api/submissions/request-url] response",
      JSON.stringify(
        { request: requestBody, responseStatus: res.status, responseData: data },
        null,
        2
      )
    );

    // Normalisasi presignedUrl & filePath
    const raw = data as Record<string, unknown>;
    const inner = (
      typeof raw.data === "object" && raw.data !== null ? raw.data : raw
    ) as Record<string, unknown>;

    const presignedUrl =
      typeof inner.presignedUrl === "string" ? inner.presignedUrl :
      typeof inner.url === "string" ? inner.url :
      typeof inner.presigned_url === "string" ? inner.presigned_url :
      typeof inner.uploadUrl === "string" ? inner.uploadUrl :
      typeof inner.upload_url === "string" ? inner.upload_url :
      typeof inner.signedUrl === "string" ? inner.signedUrl :
      undefined;

    const filePath =
      typeof inner.filePath === "string" ? inner.filePath :
      typeof inner.file_path === "string" ? inner.file_path :
      typeof inner.path === "string" ? inner.path :
      typeof inner.key === "string" ? inner.key :
      undefined;

    const normalized =
      presignedUrl !== undefined || filePath !== undefined
        ? { ...raw, ...(presignedUrl && { presignedUrl }), ...(filePath && { filePath }) }
        : data;

    if (presignedUrl === undefined && res.ok) {
      console.warn(
        "[api/submissions/request-url] Sign response missing presignedUrl. Keys:",
        Object.keys(inner)
      );
    }

    return NextResponse.json(normalized, { status: res.status });
  } catch (err) {
    console.error("POST /api/submissions/request-url proxy error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
