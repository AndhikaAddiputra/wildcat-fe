export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// 1. GET - Mengambil data
export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    const res = await fetch(`${backendUrl}/api/admin/committee`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: "Gagal mengambil data committee" }, { status: 500 });
  }
}

// 2. POST - Membuat Baru ATAU Mengedit (Upsert)
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    
    // Tembak ke endpoint POST /api/admin/committee
    const res = await fetch(`${backendUrl}/api/admin/committee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify(body) // Kirim id, name, role, division, isActive
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[Proxy POST Error] Backend membalas:", data);
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 3. DELETE - Menghapus panitia
export async function DELETE(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ambil ID dari URL Next.js (?id=...)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID tidak ditemukan" }, { status: 400 });

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    // Tembak backend Hono dengan ID di path (/:memberId)
    const res = await fetch(`${backendUrl}/api/admin/committee/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` }
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ error: data.error || "Gagal menghapus panitia" }, { status: res.status });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}