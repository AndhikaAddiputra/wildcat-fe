import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * GET /api/submissions/[requirementId]
 * Proxy ke backend: GET $API_URL/submissions/:requirementId
 * Mengembalikan signed download URL (1 jam) untuk preview/download file submission.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requirementId: string }> }
) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requirementId } = await params;

    if (!requirementId) {
      return NextResponse.json({ error: "requirementId is required" }, { status: 400 });
    }

    const base = getBackendUrl();
    const url = `${base}/api/submissions/${encodeURIComponent(requirementId)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/submissions/get] response", JSON.stringify({
      requirementId, responseStatus: res.status, responseData: data,
    }, null, 2));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/submissions/[requirementId] proxy error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
