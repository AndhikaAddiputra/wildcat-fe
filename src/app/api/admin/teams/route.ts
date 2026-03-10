export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    const url = `${backendUrl}/api/admin/teams`;

    const res = await fetch(url, { 
      headers: { Authorization: `Bearer ${session.access_token}` } 
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/teams proxy error:", err);
    return NextResponse.json({ error: "Gagal mengambil data teams" }, { status: 500 });
  }
}