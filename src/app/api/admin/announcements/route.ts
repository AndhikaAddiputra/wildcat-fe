export const dynamic = "force-dynamic";
export const revalidate = 0;

// 🌟 TAMBAHKAN DUA BARIS IMPORT INI:
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    console.log(`[${new Date().toISOString()}] 📥 FE Request: GET /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "GET",
      url: request.url,
    });

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
    console.log(`[${new Date().toISOString()}] ✅ FE Request Completed: GET /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "GET",
      status: res.status,
      dataCount: data?.data?.announcements?.length || 0,
    });
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
    const body = await request.json();
    console.log(`[${new Date().toISOString()}] 📥 FE Request: PUT /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "PUT",
      url: request.url,
      bodyKeys: Object.keys(body),
      announcementId: body?.id,
    });

    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      console.error(`[${new Date().toISOString()}] ❌ FE Request Failed: PUT /api/admin/announcements`, {
        timestamp: new Date().toISOString(),
        method: "PUT",
        announcementId: id,
        status: res.status,
        error: data?.error || "Unknown error",
      });
      console.error("[Proxy PUT Error] Backend membalas:", data);
      return NextResponse.json({ error: data.error || "Gagal mengedit pengumuman" }, { status: res.status });
    }

    console.log(`[${new Date().toISOString()}] ✅ FE Request Completed: PUT /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "PUT",
      announcementId: id,
      status: res.status,
    });

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST /api/admin/announcements proxy error:", err);
    return NextResponse.json(
      { error: "Failed to save announcement" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/announcements
 * Proxy ke backend: DELETE $API_URL/api/admin/announcements/:announcementId
 */
export async function DELETE(request: Request) {
  try {
    // 🌟 Tangkap ID dari URL (misal: /api/admin/announcements?id=123-abc)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    console.log(`[${new Date().toISOString()}] 📥 FE Request: DELETE /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "DELETE",
      url: request.url,
      announcementId: id,
    });

    const supabase = await getSupabaseServer();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      console.error(`[${new Date().toISOString()}] ❌ FE Request Failed: DELETE /api/admin/announcements`, {
        timestamp: new Date().toISOString(),
        method: "DELETE",
        announcementId: id,
        status: res.status,
        error: data?.error || "Unknown error",
      });
      console.error("[Proxy DELETE Error] Backend membalas:", data);
      return NextResponse.json({ error: data.error || "Gagal menghapus pengumuman" }, { status: res.status });
    }

    console.log(`[${new Date().toISOString()}] ✅ FE Request Completed: DELETE /api/admin/announcements`, {
      timestamp: new Date().toISOString(),
      method: "DELETE",
      announcementId: id,
      status: res.status,
    });

    return NextResponse.json({ success: true, message: data.message || "Pengumuman dihapus" });
  } catch (err) {
    console.error("DELETE /api/admin/announcements proxy error:", err);
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}