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
    const list = Array.isArray(data)
      ? data
      : (data?.transactions ??
        data?.pendingTransactions ??
        data?.items ??
        data?.payments ??
        (Array.isArray(data?.data) ? data.data : data?.data) ??
        []);
    const items = Array.isArray(list) ? list : [];
    console.log("[api/admin/transactions] GET — backend response", {
      status: res.status,
      ok: res.ok,
      dataKeys: data && typeof data === "object" ? Object.keys(data) : [],
      itemCount: items.length,
      firstItemKeys: items[0] && typeof items[0] === "object" ? Object.keys(items[0]) : [],
    });
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json({ data: items }, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/transactions error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
