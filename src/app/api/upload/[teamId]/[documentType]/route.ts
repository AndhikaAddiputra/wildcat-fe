import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * GET /api/upload/[teamId]/[documentType]
 * Proxy ke backend: GET $API_URL/upload/:teamId/:documentType
 * Mengembalikan signed download URL (1 jam) untuk preview/download dokumen administrasi.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ teamId: string; documentType: string }> }
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

    const { teamId, documentType } = await params;

    if (!teamId || !documentType) {
      return NextResponse.json({ error: "teamId and documentType are required" }, { status: 400 });
    }

    const base = getBackendUrl();
    const url = `${base}/api/upload/${encodeURIComponent(teamId)}/${encodeURIComponent(documentType)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/upload/get] response", JSON.stringify({
      teamId, documentType, responseStatus: res.status, responseData: data,
    }, null, 2));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/upload/[teamId]/[documentType] proxy error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
