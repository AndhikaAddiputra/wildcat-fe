import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/transactions/request-url
 * Proxy to backend: POST $BACKEND_URL/api/transactions/request-url
 * Step 1: Generate presigned PUT URL for payment receipt upload.
 * Security: Participant Auth.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    console.log("[api/transactions/request-url] POST — requesting presigned URL", {
      filename: body.filename,
      content_type: body.content_type,
    });
    const res = await fetch(`${backendUrl}/api/transactions/request-url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    const hasPresignedUrl = !!(
      data?.presignedUrl ?? data?.presigned_url ?? data?.presigned_put_url ?? data?.putUrl ?? data?.put_url ??
      data?.uploadUrl ?? data?.upload_url ?? data?.url ?? data?.signedUrl ?? data?.signed_url ??
      (data?.data as Record<string, unknown>)?.presignedUrl ?? (data?.data as Record<string, unknown>)?.presigned_url ??
      (data?.data as Record<string, unknown>)?.putUrl ?? (data?.data as Record<string, unknown>)?.upload_url
    );
    const hasFilePath = !!(
      data?.filePath ?? data?.file_path ?? data?.object_key ?? data?.key ?? data?.path ??
      (data?.data as Record<string, unknown>)?.filePath ?? (data?.data as Record<string, unknown>)?.file_path
    );
    console.log("[api/transactions/request-url] POST — backend response", {
      status: res.status,
      ok: res.ok,
      hasPresignedUrl,
      hasFilePath,
      ...(!hasPresignedUrl && { debug_responseKeys: Object.keys(data ?? {}), debug_dataKeys: data?.data ? Object.keys(data.data as object) : [] }),
    });
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/transactions/request-url] POST error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
