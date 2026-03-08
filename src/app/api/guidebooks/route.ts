import { NextResponse } from "next/server";
import { getGuidebooksList } from "@/lib/constants/guidebooks";

/**
 * GET /api/guidebooks
 * Mengembalikan daftar guidebook (id, name, url) untuk setiap kompetisi.
 */
export async function GET() {
  const guidebooks = getGuidebooksList();
  return NextResponse.json({ guidebooks });
}
