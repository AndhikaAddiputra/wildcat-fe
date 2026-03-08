import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

const RETRY_DELAY_MS = 500;
const MAX_PROXY_RETRIES = 2;

/**
 * GET /api/announcements
 * Proxy ke backend. Dengan token: announcements target_audience = "All" atau kompetisi user.
 * Tanpa token: target_audience = "All" saja. Response array ordered by created_at (newest first).
 * Retry hingga 2x pada 5xx (termasuk read-after-write atau Internal Server Error).
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    const base = getBackendUrl();
    const url = `${base}/api/announcements`;

    const doFetch = () =>
      fetch(url, {
        method: "GET",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

    let res = await doFetch();
    for (let r = 0; r < MAX_PROXY_RETRIES && res.status >= 500; r++) {
      await new Promise((x) => setTimeout(x, RETRY_DELAY_MS));
      res = await doFetch();
    }

    const data = await res.json().catch(() => (res.status >= 500 ? { success: false, error: "Internal Server Error" } : []));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/announcements proxy error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
