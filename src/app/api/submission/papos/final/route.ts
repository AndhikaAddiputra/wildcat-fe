import { NextResponse } from "next/server";

/**
 * POST /api/submission/papos/final — final stage (Full Paper + Poster)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("full_paper") || !formData.has("poster")) {
      return NextResponse.json({ error: "full_paper and poster are required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
