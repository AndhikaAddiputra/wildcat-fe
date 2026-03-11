import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/payment/status
 * Proxy to backend: GET $BACKEND_URL/api/payment/status
 * Check current payment status for authenticated team.
 * Auth: Bearer token required.
 * Response: { hasPayment, orderId, status, paymentLink, ... } or { hasPayment: false, message }
 */
export async function GET() {
  console.log("[api/payment/status] GET — request received");
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.log("[api/payment/status] GET — 401 Unauthorized (no session)");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
  console.log("[api/payment/status] GET — proxying to backend", { backendUrl: `${backendUrl}/api/payment/status`, userId: session.user?.id?.slice(0, 8) });

  try {
    const res = await fetch(`${backendUrl}/api/payment/status`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));
    console.log("[api/payment/status] GET — backend response", {
      httpStatus: res.status,
      ok: res.ok,
      hasPayment: data?.hasPayment ?? null,
      orderId: data?.orderId ?? null,
      paymentStatus: data?.status ?? null,
      isLinkValid: data?.isLinkValid ?? null,
      error: data?.error ?? null,
    });
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/payment/status] GET — error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
