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
    // Coba endpoint terpadu GET /api/admin/metrics dulu (jika backend mendukung)
    const unifiedRes = await fetch(`${backendUrl}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (unifiedRes.ok) {
      const data = await unifiedRes.json();
      // Jika response punya competitions + grandTotals, gunakan endpoint terpadu
      if (data?.competitions != null) {
        return NextResponse.json({
          success: true,
          competitions: data,
          events: data.events ?? { events: [], grandTotals: { registeredCount: 0, attendedCount: 0 } },
          curves: data.curves ?? data.registrationCurves ?? [],
        });
      }
    }

    // Fallback: panggil endpoint terpisah
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
    const curvesData = await curvesRes.json();

    return NextResponse.json({
      success: true,
      competitions: competitionsData,
      events: eventsData,
      curves: curvesData,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}