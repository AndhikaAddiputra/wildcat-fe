import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PATCH /api/admin/transactions/[transaction_id]/verify
 * Proxy to backend: PATCH $BACKEND_URL/api/admin/transactions/:transaction_id/verify
 * Body: { status: 'Verified' | 'Rejected', rejection_reason?: string }
 * Security: CommitteeAccount middleware (Admin/Committee roles only).
 */
export async function PATCH(
  request: Request,
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

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const status = body.status as string | undefined;
  const rejection_reason = (body.rejection_reason ?? body.rejectionReason ?? body.rejectionNotes) as string | undefined;

  if (!status || (status !== "Verified" && status !== "Rejected")) {
    return NextResponse.json({ error: 'status must be "Verified" or "Rejected"' }, { status: 400 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(`${backendUrl}/api/admin/transactions/${encodeURIComponent(transaction_id)}/verify`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        ...(rejection_reason && { rejection_reason: rejection_reason }),
      }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("PATCH /api/admin/transactions/[transaction_id]/verify error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
