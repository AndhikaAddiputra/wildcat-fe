import { NextResponse } from "next/server";

/**
 * POST /api/submission/gng — preliminary (Technical Essay)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("technical_essay")) {
      return NextResponse.json({ error: "technical_essay is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
