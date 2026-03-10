import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/admin/submissions
 * Proxy to backend: GET $BACKEND_URL/api/admin/submissions
 * Get all teams' submissions grouped by competition.
 * Security: Admin or Committee role (validated by backend).
 *
 * Response: { success: true, data: CompetitionSubmission[] }
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(`${backendUrl}/api/admin/submissions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/admin/submissions] status:", res.status);
    if (res.status >= 400) {
      console.log("[api/admin/submissions] backend response:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/submissions error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
