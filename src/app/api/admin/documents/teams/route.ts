import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/admin/documents/teams
 * Proxy ke backend: GET $BACKEND_URL/api/admin/documents/teams
 * Mengembalikan semua tim beserta dokumen administrasi + signed download URLs.
 * Security: Admin or Committee role (divalidasi oleh backend).
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(`${backendUrl}/api/admin/documents/teams`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/admin/documents/teams] status:", res.status);
    if (res.status >= 400) {
      console.log("[api/admin/documents/teams] backend response:", JSON.stringify(data, null, 2));
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/documents/teams error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
