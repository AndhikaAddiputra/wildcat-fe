import { NextResponse } from "next/server";

/**
 * POST /api/submission/papos — preliminary (Extended Abstract)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("extended_abstract")) {
      return NextResponse.json({ error: "extended_abstract is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
