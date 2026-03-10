import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";
import type { RegisterCompleteBody } from "@/lib/api/types";

const RETRY_DELAY_MS = 600;

/**
 * POST /api/landing/register/complete
 * Proxy ke backend: POST {backend}/api/landing/register/complete dengan body dan Bearer token.
 * Retry sekali jika backend mengembalikan 5xx (mis. DB cold start saat query competitions).
 * Body: { competitionId, teamName, leadName, institution, leadMajor, phoneNumber, lineId, m1Name?, m1Major?, m2Name?, m2Major? }
 * Response: { teamId: string, created: boolean }
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

    const body = (await request.json()) as RegisterCompleteBody;
    const {
      competitionId,
      teamName,
      leadName,
      institution,
      leadMajor,
      phoneNumber,
      lineId,
      m1Name,
      m1Major,
      m2Name,
      m2Major,
    } = body;

    if (
      !competitionId ||
      !teamName ||
      !leadName ||
      !institution ||
      !leadMajor ||
      !phoneNumber ||
      !lineId
    ) {
      return NextResponse.json(
        {
          error:
            "Team Name, Leader Name, Institution, Leader Major, Phone Number, and Line ID must be filled",
        },
        { status: 400 }
      );
    }

    const base = getBackendUrl();
    const url = `${base}/api/landing/register/complete`;
    const payload = {
      competitionId,
      teamName,
      leadName,
      institution,
      leadMajor,
      phoneNumber,
      lineId,
      ...(m1Name !== undefined && { m1Name }),
      ...(m1Major !== undefined && { m1Major }),
      ...(m2Name !== undefined && { m2Name }),
      ...(m2Major !== undefined && { m2Major }),
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
    console.error("POST /api/landing/register/complete proxy error:", err);
    return NextResponse.json(
      { error: "Failed to save team data" },
      { status: 500 }
    );
  }
}
