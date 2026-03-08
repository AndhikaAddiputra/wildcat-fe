import { NextResponse } from "next/server";

/**
 * POST /api/administration/payment-proof
 * Menerima upload bukti pembayaran.
 * TODO: integrasi ke backend (Supabase storage / API).
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("payment_proof")) {
      return NextResponse.json(
        { error: "Payment proof file is required" },
        { status: 400 }
      );
    }
    // TODO: upload ke storage / backend
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
