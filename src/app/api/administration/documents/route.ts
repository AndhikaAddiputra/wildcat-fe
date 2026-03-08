import { NextResponse } from "next/server";

/**
 * POST /api/administration/documents
 * Menerima upload dokumen (KTM, Proof of Posting Twibbon, Proof of Posting Poster on IG Status).
 * TODO: integrasi ke backend (Supabase storage / API).
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    // formData.get("ktm_leader"), formData.get("full_paper"), dll.
    if (!formData.has("ktm_leader") && !formData.has("proof_twibbon") && !formData.has("proof_poster_ig")) {
      return NextResponse.json(
        { error: "At least one document is required" },
        { status: 400 }
      );
    }
    // TODO: upload ke storage / backend, lalu simpan referensi di DB
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
