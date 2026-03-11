import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  context: any // Menggunakan 'any' untuk menghindari konflik tipe params antara Next.js 14 & 15
) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Handle params secara aman untuk Next.js 14 maupun 15
  const params = await Promise.resolve(context.params);
  const transaction_id = params?.transaction_id;

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
  const targetUrl = `${backendUrl}/api/admin/transactions/${encodeURIComponent(transaction_id)}/verify`;

  try {
    console.log(`[VERIFY PATCH] Meneruskan ke: ${targetUrl}`);
    console.log(`[VERIFY PATCH] Body yang dikirim:`, { status, rejection_reason });

    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        ...(rejection_reason && { rejection_reason }),
      }),
    });

    // Kita baca sebagai text dulu agar tidak crash jika backend mengirim HTML error
    const responseText = await res.text();
    console.log(`[VERIFY PATCH] Status dari Backend: ${res.status}`);
    console.log(`[VERIFY PATCH] Response dari Backend:`, responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { error: responseText };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[VERIFY PATCH] Error internal Next.js:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}