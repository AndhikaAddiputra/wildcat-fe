import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/transactions
 * Proxy to backend: GET $BACKEND_URL/api/transactions
 * Retrieve the team's latest payment submission details.
 * Security: Participant Auth.
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    console.log("[api/transactions] GET — fetching team's latest payment submission");
    const res = await fetch(`${backendUrl}/api/transactions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));
    const inner = (data?.data ?? data) as Record<string, unknown>;
    console.log("[api/transactions] GET — backend response", {
      status: res.status,
      ok: res.ok,
      hasData: !!data?.data,
      verificationStatus: inner?.verificationStatus ?? inner?.verification_status ?? data?.verificationStatus,
      hasPaymentProofUrl: !!(inner?.paymentProofUrl ?? inner?.payment_proof_url ?? inner?.file_url),
      hasProofSignedUrl: !!(inner?.proofSignedUrl ?? inner?.proof_signed_url ?? inner?.signedUrl ?? inner?.previewUrl ?? inner?.downloadUrl ?? inner?.download_url),
      dataKeys: inner && typeof inner === "object" ? Object.keys(inner) : [],
      data: inner && typeof inner === "object" ? inner : data,
    });
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/transactions] GET error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
