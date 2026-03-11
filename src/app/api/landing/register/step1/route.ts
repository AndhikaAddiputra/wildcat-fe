import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

const RETRY_DELAY_MS = 600;

/**
 * POST /api/landing/register/step1
 * Proxy ke backend: POST {backend}/api/landing/register/step1 dengan body dan Bearer token.
 * Retry sekali jika backend mengembalikan 5xx (mis. DB cold start saat query competitions).
 * Body: { competitionId, teamName, leadName, institution, leadMajor }
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

    const body = await request.json();
    const { competitionId, teamName, leadName, institution, leadMajor } = body;

    if (!competitionId || !teamName || !leadName || !institution || !leadMajor) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    const url = `${base}/api/landing/register/step1`;
    const payload = {
      competitionId,
      teamName,
      leadName,
      institution,
      leadMajor,
    };

    const doFetch = () =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

    let res = await doFetch();
    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      res = await doFetch();
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST /api/landing/register/step1 proxy error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
