import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

const RETRY_DELAY_MS = 600;

/**
 * GET /api/landing/team
 * Proxy ke backend: GET {backend}/api/landing/team dengan Bearer token dari session.
 * Retry sekali jika backend mengembalikan error (mis. DB cold start).
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const base = getBackendUrl();
    const url = `${base}/api/landing/team`;

    const doFetch = () =>
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

    let res = await doFetch();

    if (!res.ok && res.status >= 500) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      res = await doFetch();
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/landing/team proxy error:", err);
    return NextResponse.json(
      { error: "Gagal memuat data tim" },
      { status: 500 }
    );
  }
}
