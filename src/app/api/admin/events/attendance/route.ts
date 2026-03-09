import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { eventId, attendedCount } = body;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

    // 🌟 MENGGUNAKAN ENDPOINT DARI TEMAN BACKEND-MU:
    const endpointUrl = `${backendUrl}/api/admin/events/${eventId}/attendance`;

    const response = await fetch(endpointUrl, {
      method: "PATCH", // 🌟 MENGGUNAKAN METHOD PATCH
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ attendedCount }), 
    });

    // Baca sebagai text untuk mencegah error JSON Parse (seperti yang kamu alami sebelumnya)
    const textResponse = await response.text();
    let data;
    
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      data = { message: textResponse };
    }
    
    if (!response.ok) {
      throw new Error(`Backend Error ${response.status}: ${data.message || textResponse}`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}