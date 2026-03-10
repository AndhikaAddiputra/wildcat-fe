import { NextResponse } from "next/server";

/**
 * POST /api/register
 * Menerima data registrasi (team name, leader name, university, major, competition)
 * yang dikirim dari frontend setelah user mengklik "Continue" di step terakhir.
 * TODO: integrasi ke backend (Supabase/database) dan auth (Google).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamName, leaderFullName, university, major, competitionId } = body;

    if (
      typeof teamName !== "string" ||
      typeof leaderFullName !== "string" ||
      typeof university !== "string" ||
      typeof major !== "string" ||
      typeof competitionId !== "string"
    ) {
      return NextResponse.json(
        { error: "teamName, leaderFullName, university, major, and competitionId are required." },
        { status: 400 }
      );
    }

    // TODO: simpan ke database & hubungkan dengan user (setelah Google auth)
    // const team = await createTeam({ teamName, leaderFullName, university, major, competitionId });

    return NextResponse.json({
      success: true,
      message: "Registration received successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
