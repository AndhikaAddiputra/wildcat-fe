import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  console.log("===================================================");
  console.log("🚀 [API PROXY] /api/admin/attendance DIPANGGIL");
  console.log("===================================================");

  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.log("❌ [ERROR] Tidak ada session (Unauthorized)");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Cek Body Request dari Frontend
    const body = await request.json();
    console.log("📦 [PAYLOAD DARI FRONTEND]:", body);

    const { eventId, attendedCount } = body;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

    // 2. Cek URL Endpoint Hono
    const endpointUrl = `${backendUrl}/api/admin/events/${eventId}/attendance`;
    console.log("🔗 [MENEMBAK BACKEND HONO]:", endpointUrl);

    // 3. Tembak API
    const response = await fetch(endpointUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ attendedCount }), 
    });

    console.log(`📡 [STATUS DARI HONO]: ${response.status} ${response.statusText}`);

    // 4. BACA RAW TEXT DARI BE (Ini kunci untuk mencegah JSON.parse error)
    const textResponse = await response.text();
    console.log(`📝 [RAW RESPONSE DARI HONO]:`, textResponse);

    let data = {};
    
    // 5. Coba jadikan JSON, tapi buat super aman
    if (textResponse) {
      try {
        data = JSON.parse(textResponse);
        console.log(`✅ [BERHASIL PARSE JSON]:`, data);
      } catch (parseError) {
        console.log(`⚠️ [GAGAL PARSE JSON] Balasan BE bukan JSON!`);
        data = { message: textResponse }; // Simpan sebagai teks saja
      }
    }

    if (!response.ok) {
      console.log(`❌ [RESPONSE NOT OK] Melempar error ke frontend...`);
      return NextResponse.json(
        { success: false, error: (data as { message?: string }).message || textResponse || "Unknown Error" }, 
        { status: response.status }
      );
    }

    console.log("🎉 [SUKSES] Data berhasil diupdate!");
    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("🔥 [FATAL ERROR DI NEXT.JS]:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}