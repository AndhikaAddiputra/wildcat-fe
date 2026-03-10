import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * POST /api/upload/sign
 * Proxy ke backend: POST $API_URL/sign
 * Body: { teamId, documentType, fileName, contentType }
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
    const { teamId, documentType, fileName, contentType } = body as Record<string, string>;

    if (!teamId || !documentType || !fileName || !contentType) {
      return NextResponse.json(
        { error: "teamId, documentType, fileName, contentType required" },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    const signPath = process.env.UPLOAD_SIGN_PATH || "/sign";
    const url = `${base}${signPath.startsWith("/") ? "" : "/"}${signPath}`;

    const requestBody = { teamId, documentType, fileName, contentType };

    let res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (res.status === 404 && signPath === "/sign") {
      const altUrl = `${base}/api/upload/sign`;
      res = await fetch(altUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    }

    const data = await res.json().catch(() => ({}));
    if (res.status === 404) {
      console.error(
        "Backend upload sign returned 404. Tried:",
        url,
        signPath === "/sign" ? ", then " + base + "/api/upload/sign" : ""
      );
    }

    // Response logger (JSON.stringify agar nested object seperti .error.details tidak truncate)
    console.log("[api/upload/sign] response", JSON.stringify({
      request: { teamId, documentType, fileName, contentType },
      responseStatus: res.status,
      responseData: data,
    }, null, 2));

    // Normalisasi: backend bisa pakai presigned_url, file_path, url, dll. (flat atau nested di .data)
    const raw = data as Record<string, unknown>;
    const inner = (typeof raw.data === "object" && raw.data !== null
      ? raw.data
      : raw) as Record<string, unknown>;

    const presignedUrl =
      typeof inner.presignedUrl === "string"
        ? inner.presignedUrl
        : typeof inner.url === "string"
          ? inner.url
          : typeof inner.presigned_url === "string"
            ? inner.presigned_url
            : typeof inner.uploadUrl === "string"
              ? inner.uploadUrl
              : typeof inner.upload_url === "string"
                ? inner.upload_url
                : typeof inner.signedUrl === "string"
                  ? inner.signedUrl
                  : undefined;
    const filePath =
      typeof inner.filePath === "string"
        ? inner.filePath
        : typeof inner.file_path === "string"
          ? inner.file_path
          : typeof inner.path === "string"
            ? inner.path
            : typeof inner.key === "string"
              ? inner.key
              : undefined;

    const normalized =
      presignedUrl !== undefined && filePath !== undefined
        ? { ...raw, presignedUrl, filePath }
        : data;

    if ((presignedUrl === undefined || filePath === undefined) && res.ok) {
      console.warn(
        "[api/upload/sign] Backend response missing expected fields. Top-level keys:",
        Object.keys(raw),
        "inner keys:",
        Object.keys(inner)
      );
    }

    return NextResponse.json(normalized, { status: res.status });
  } catch (err) {
    console.error("POST /api/upload/sign proxy error:", err);
    return NextResponse.json(
      { error: "Failed to get upload URL" },
      { status: 500 }
    );
  }
}
