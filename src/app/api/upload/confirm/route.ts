import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * POST /api/upload/confirm
 * Proxy ke backend: POST $API_URL/confirm
 * Body: { teamId, documentType, filePath } — filePath dari response Step 1 (sign).
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
    const { teamId, documentType, filePath } = body as Record<string, string>;

    if (!teamId || !documentType || !filePath) {
      return NextResponse.json(
        { error: "teamId, documentType, filePath required" },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    const confirmPath = process.env.UPLOAD_CONFIRM_PATH || "/confirm";
    const url = `${base}${confirmPath.startsWith("/") ? "" : "/"}${confirmPath}`;

    const backendTimeoutMs = 30_000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), backendTimeoutMs);

    const requestBody = {
      teamId,
      documentType,
      filePath,
      // snake_case aliases
      team_id: teamId,
      document_type: documentType,
      file_path: filePath,
    };

    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (res.status === 404 && confirmPath === "/confirm") {
      const altUrl = `${base}/api/upload/confirm`;
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), backendTimeoutMs);
      try {
        res = await fetch(altUrl, {
          method: "POST",
          signal: controller2.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
      } finally {
        clearTimeout(timeoutId2);
      }
    }

    const data = await res.json().catch(() => ({}));

    // Response logger (JSON.stringify agar nested object tidak truncate)
    console.log("[api/upload/confirm] response", JSON.stringify({
      request: { teamId, documentType, filePath },
      responseStatus: res.status,
      responseData: data,
    }, null, 2));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const isTimeout =
      err instanceof Error &&
      (err.name === "AbortError" || (err as { cause?: Error }).cause?.name === "ConnectTimeoutError");
    console.error("POST /api/upload/confirm proxy error:", err);
    return NextResponse.json(
      {
        error: isTimeout
          ? "Backend did not respond in time. Check connection to backend or BACKEND_URL."
          : "Failed to confirm upload",
      },
      { status: 500 }
    );
  }
}
