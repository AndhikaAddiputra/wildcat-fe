import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/admin/submissions/download?teamId=...&requirementId=...
 * Proxy to backend to get signed download URL for a team's submission file.
 * Security: Admin or Committee role (validated by backend).
 *
 * Backend may use: GET $BACKEND_URL/api/admin/submissions/download?teamId=...&requirementId=...
 * or: GET $BACKEND_URL/api/admin/submissions/:teamId/:requirementId
 * Returns: { signedUrl } or { data: { signedUrl } }
 */
export async function GET(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get("teamId");
  const requirementId = searchParams.get("requirementId");
  const filePath = searchParams.get("filePath");

  if (!teamId || !requirementId) {
    return NextResponse.json(
      { error: "teamId and requirementId are required" },
      { status: 400 }
    );
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    // Backend: GET /api/admin/submissions/:teamId/:requirementId
    // Or with filePath: GET /api/admin/submissions/download?teamId=...&requirementId=...&filePath=...
    let url = `${backendUrl}/api/admin/submissions/${encodeURIComponent(teamId)}/${encodeURIComponent(requirementId)}`;
    if (filePath) {
      url += `?filePath=${encodeURIComponent(filePath)}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    const inner = (data.data ?? data) as Record<string, unknown>;
    const signedUrl =
      (inner?.signedUrl as string) ??
      (inner?.signed_url as string) ??
      (data.signedUrl as string) ??
      (data.signed_url as string);

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    if (signedUrl) {
      return NextResponse.json({ signedUrl });
    }

    // Backend might return redirect or different structure
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/submissions/download error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
