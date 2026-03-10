import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/admin/verify
 * Proxy ke backend: POST $BACKEND_URL/api/admin/verify
 * Body: { teamId: string, action: "Verified" | "Rejected", rejectionNotes?: string }
 * Security: Admin or Committee role (divalidasi oleh backend).
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch((e) => {
    console.log("[api/admin/verify] Failed to parse body:", e);
    return {};
  }) as {
    teamId?: string;
    action?: string;
    rejectionNotes?: string;
    rejection_notes?: string;
    documentRejectionNotes?: string;
    document_rejection_notes?: string;
  };

  const { teamId, action } = body;
  const notes =
    (
      body.documentRejectionNotes ??
      body.document_rejection_notes ??
      body.rejectionNotes ??
      body.rejection_notes ??
      ""
    ).trim() || undefined;

  if (!teamId || !action) {
    return NextResponse.json({ error: "teamId and action are required" }, { status: 400 });
  }
  if (action !== "Verified" && action !== "Rejected") {
    return NextResponse.json({ error: 'action must be "Verified" or "Rejected"' }, { status: 400 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3030";

  try {
    const payload: Record<string, string> = { teamId, action };
    if (notes) {
      payload.rejectionNotes = notes;
      payload.rejection_notes = notes;
      payload.documentRejectionNotes = notes;
      payload.document_rejection_notes = notes;
    }

    console.log("[api/admin/verify] Request body:", JSON.stringify(body, null, 2));
    console.log("[api/admin/verify] Payload to backend:", JSON.stringify(payload, null, 2));

    const res = await fetch(`${backendUrl}/api/admin/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    console.log("[api/admin/verify] Backend status:", res.status);
    console.log("[api/admin/verify] Backend response:", JSON.stringify(data, null, 2));

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("POST /api/admin/verify error:", err);
    return NextResponse.json({ error: "Failed to reach server" }, { status: 500 });
  }
}
