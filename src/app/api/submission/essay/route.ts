import { NextResponse } from "next/server";

/**
 * POST /api/submission/essay
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("abstract") || !formData.has("full_essay")) {
      return NextResponse.json({ error: "abstract and full_essay are required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
