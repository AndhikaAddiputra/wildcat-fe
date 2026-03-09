export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    // Panggil kedua endpoint backend Hono secara paralel agar lebih cepat
    const [compRes, eventRes, curvesRes] = await Promise.all([
      fetch(`${backendUrl}/api/admin/metrics/competitions`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }),
      fetch(`${backendUrl}/api/admin/metrics/events`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }),
      fetch(`${backendUrl}/api/admin/analytics/registration-curves`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
    ]);

    const competitionsData = await compRes.json();
    const eventsData = await eventRes.json();
    const curvesData = await curvesRes.json(); // Data baru

    return NextResponse.json({
      success: true,
      competitions: competitionsData,
      events: eventsData,
      curves: curvesData // Kirim ke frontend
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}