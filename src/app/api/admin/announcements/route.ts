import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";
import { ANNOUNCEMENT_AUDIENCE } from "@/lib/constants/announcement-audience";
import type { AnnouncementUpsertBody } from "@/lib/api/types";

const VALID_AUDIENCES = new Set(Object.values(ANNOUNCEMENT_AUDIENCE));

/**
 * POST /api/admin/announcements
 * Proxy ke backend: POST $API_URL/api/admin/announcements
 * Body: { title, content, targetAudience, attachmentUrl? }
 * targetAudience harus salah satu dari ANNOUNCEMENT_AUDIENCE enum.
 */
export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<AnnouncementUpsertBody>;
    const { title, content, targetAudience, attachmentUrl, id } = body;

    if (!title || !content || !targetAudience) {
      return NextResponse.json(
        { error: "title, content, targetAudience are required" },
        { status: 400 }
      );
    }

    if (!VALID_AUDIENCES.has(targetAudience as (typeof ANNOUNCEMENT_AUDIENCE)[keyof typeof ANNOUNCEMENT_AUDIENCE])) {
      return NextResponse.json(
        {
          error: `targetAudience must be one of: ${[...VALID_AUDIENCES].join(", ")}`,
        },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    // PUT jika ada id (update), POST jika baru (create)
    const method = id ? "PUT" : "POST";
    const url = id
      ? `${base}/api/admin/announcements/${id}`
      : `${base}/api/admin/announcements`;

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        targetAudience,
        ...(attachmentUrl ? { attachmentUrl } : {}),
      }),
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/admin/announcements] response", JSON.stringify({
      method,
      url,
      requestBody: { title, content, targetAudience, attachmentUrl, id },
      responseStatus: res.status,
      responseData: data,
    }, null, 2));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST /api/admin/announcements proxy error:", err);
    return NextResponse.json(
      { error: "Gagal menyimpan announcement" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/announcements?id=<uuid>
 * Proxy ke backend: DELETE $API_URL/api/admin/announcements/:id
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id query parameter required" }, { status: 400 });
    }

    const base = getBackendUrl();
    const url = `${base}/api/admin/announcements/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("DELETE /api/admin/announcements proxy error:", err);
    return NextResponse.json({ error: "Gagal menghapus announcement" }, { status: 500 });
  }
}
