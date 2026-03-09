import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Tangkap data dari body request frontend
    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

    // Kirim ke backend Hono
    // Sesuaikan URL ini dengan endpoint POST yang dibuat teman BE kamu
    const response = await fetch(`${backendUrl}/api/admin/events/attendance`, {
      method: "POST", // atau PUT/PATCH sesuai BE
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to update attendance");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}