import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/admin/transactions
 * Proxy to backend: GET $BACKEND_URL/api/admin/transactions
 * Returns list of teams with manual payment submissions for committee verification.
 * Security: Admin or Committee role (validated by backend).
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(`${backendUrl}/api/admin/transactions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));
    console.log("=== DEBUG RESPONSE ASLI BACKEND ===");
    // JSON.stringify dengan parameter (..., null, 2) akan merapikan format JSON-nya
    console.log(JSON.stringify(data, null, 2)); 
    console.log("===================================");
    // Langsung teruskan datanya apa adanya ke frontend
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/transactions error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
    
}
