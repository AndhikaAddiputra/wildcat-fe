import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * GET /api/events
 * Proxy ke backend: GET {backend}/api/events dengan Bearer token.
 */
export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    const base = getBackendUrl();
    const url = `${base}/api/events`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => []);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("GET /api/events proxy error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
