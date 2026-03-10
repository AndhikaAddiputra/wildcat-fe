import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/admin/transactions/[transaction_id]
 * Proxy to backend: GET $BACKEND_URL/api/admin/transactions/:transaction_id
 * Preview a team's payment submission with signed download URL.
 * Security: Admin or Committee role.
 *
 * Response: { success: true, data: { id, teamId, teamName, paymentProofUrl, ... } }
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transaction_id: string }> }
) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { transaction_id } = await params;
  if (!transaction_id) {
    return NextResponse.json({ error: "transaction_id is required" }, { status: 400 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(
      `${backendUrl}/api/admin/transactions/${encodeURIComponent(transaction_id)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${session.access_token}` },
      }
    );

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/transactions/[transaction_id] error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
