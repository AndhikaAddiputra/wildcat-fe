import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * GET /api/transactions/preview
 * Fetches transaction from backend and returns signed URL for payment proof.
 * Backend GET /api/transactions returns the signed URL in the transaction data.
 */
export async function GET() {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const res = await fetch(`${backendUrl}/api/transactions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const data = await res.json().catch(() => ({}));
    const inner = (data?.data ?? data) as Record<string, unknown>;

    const signedUrl =
      (inner?.signedUrl as string) ??
      (inner?.signed_url as string) ??
      (inner?.downloadUrl as string) ??
      (inner?.download_url as string) ??
      (inner?.proofSignedUrl as string) ??
      (inner?.proof_signed_url as string) ??
      (inner?.previewUrl as string) ??
      (inner?.url as string);

    if (!signedUrl || typeof signedUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "No payment proof available or URL expired" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { signedUrl },
    });
  } catch (err) {
    console.error("GET /api/transactions/preview error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
