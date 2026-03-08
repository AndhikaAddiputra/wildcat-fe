import { NextResponse } from "next/server";

/**
 * POST /api/submission/bcc — preliminary (Business Proposal)
 * TODO: integrasi ke backend.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    if (!formData.has("business_proposal")) {
      return NextResponse.json({ error: "business_proposal is required" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
