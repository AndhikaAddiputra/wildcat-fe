import { NextResponse } from "next/server";

/**
 * POST /api/submission/gng/final — final stage (Technical Report)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("technical_report")) {
      return NextResponse.json({ error: "technical_report is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
