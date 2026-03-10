export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🌟 TAMBAHKAN DUA BARIS IMPORT INI:
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
    // 🌟 SEKARANG KITA TEMBAK ENDPOINT KHUSUS ADMIN
    const url = `${backendUrl}/api/admin/announcements`;

    const res = await fetch(url, { 
      headers: { Authorization: `Bearer ${session.access_token}` } 
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/admin/announcements proxy error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data pengumuman" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/announcements
 * Proxy ke backend: PUT $API_URL/api/admin/announcements/:id
 */
export async function PUT(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, targetAudience, attachmentUrl, scheduledFor } = body;

    // Pastikan ID ada sebelum mengedit
    if (!id) {
      return NextResponse.json({ error: "ID pengumuman tidak ditemukan" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    // 🌟 TEMBAK KE URL SPESIFIK BESERTA ID-NYA
    const url = `${backendUrl}/api/admin/announcements/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      // Kirim datanya tanpa menyertakan id lagi di body (karena sudah ada di URL)
      body: JSON.stringify({ title, content, targetAudience, attachmentUrl, scheduledFor }),
    });

    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error("[Proxy PUT Error] Backend membalas:", data);
      return NextResponse.json({ error: data.error || "Gagal mengedit pengumuman" }, { status: res.status });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("PUT /api/admin/announcements proxy error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/announcements
 * Proxy ke backend: DELETE $API_URL/api/admin/announcements/:announcementId
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🌟 Tangkap ID dari URL (misal: /api/admin/announcements?id=123-abc)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID pengumuman tidak ditemukan" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";
    
    // 🌟 Tembak backend Hono dengan ID di ujung URL
    const url = `${backendUrl}/api/admin/announcements/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
      console.error("[Proxy DELETE Error] Backend membalas:", data);
      return NextResponse.json({ error: data.error || "Gagal menghapus pengumuman" }, { status: res.status });
    }

    return NextResponse.json({ success: true, message: data.message || "Pengumuman dihapus" });
  } catch (err) {
    console.error("DELETE /api/admin/announcements proxy error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}