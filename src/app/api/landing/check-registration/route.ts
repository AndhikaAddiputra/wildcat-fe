import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

const RETRY_DELAY_MS = 600;

/**
 * GET /api/landing/check-registration
 * Proxy ke backend: GET {backend}/api/landing/check-registration dengan Bearer token.
 * Retry sekali jika backend mengembalikan 5xx (mis. DB cold start).
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      return NextResponse.json({ registered: false }, { status: 200 });
    }

    const base = getBackendUrl();
    const url = `${base}/api/landing/check-registration`;

    const doFetch = () =>
      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

    let res = await doFetch();
    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      res = await doFetch();
    }

    const data = await res.json().catch(() => ({ registered: false }));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/landing/check-registration proxy error:", err);
    return NextResponse.json(
      { registered: false, error: "Gagal mengecek registrasi" },
      { status: 200 }
    );
  }
}
