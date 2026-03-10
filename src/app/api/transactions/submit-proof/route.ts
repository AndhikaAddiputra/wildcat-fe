import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/transactions/submit-proof
 * Proxy to backend: POST $BACKEND_URL/api/transactions/submit-proof
 * Step 2: Submit payment proof URL + payment method after upload.
 * Payload: { file_url: string, payment_method: string }
 * Security: Participant Auth.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const fileUrl = body.file_url ?? body.fileUrl;
    console.log("[api/transactions/submit-proof] POST — submitting payment proof", {
      payment_method: body.payment_method ?? body.paymentMethod,
      file_url_length: typeof fileUrl === "string" ? fileUrl.length : 0,
      file_url_preview: typeof fileUrl === "string" ? `${fileUrl.slice(0, 50)}${fileUrl.length > 50 ? "…" : ""}` : null,
    });
    const res = await fetch(`${backendUrl}/api/transactions/submit-proof`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    console.log("[api/transactions/submit-proof] POST — backend response", {
      status: res.status,
      ok: res.ok,
      success: data?.success ?? data?.data?.success,
    });
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[api/transactions/submit-proof] POST error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
