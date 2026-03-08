import { NextResponse } from "next/server";

/**
 * POST /api/submission/bcc/final — final stage (Pitch Deck)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("pitch_deck")) {
      return NextResponse.json({ error: "pitch_deck is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
