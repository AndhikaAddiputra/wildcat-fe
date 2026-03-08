"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { COMPETITION_SUBMISSION_ROUTES } from "@/lib/constants/competitions";
import { competitionUuidToId } from "@/lib/constants/guidebooks";
import { Spinner } from "@/components/ui";

/**
 * Halaman /submission — dispatcher yang meredirect peserta ke submission page
 * sesuai dengan kompetisi yang mereka ikuti.
 *
 * Jika competitionId tidak dikenali atau tim belum punya kompetisi,
 * peserta tetap di halaman ini dengan pesan informatif.
 */
export default function SubmissionIndexPage() {
  const router = useRouter();
  const { data, loading } = useTeamProfile();

  useEffect(() => {
    if (loading) return;

    const rawId = data?.competitionId;
    if (!rawId) return;

    // competitionId dari DB adalah UUID — konversi ke string ID ("business-case", dll.)
    const competitionId = competitionUuidToId(rawId) ?? rawId;
    const route = COMPETITION_SUBMISSION_ROUTES[competitionId];
    if (route) {
      router.replace(route);
    }
  }, [loading, data, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(/background-hero-still.svg)] bg-cover text-white flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-xl font-semibold text-[#F1E1B4]">
          Kompetisi kamu belum terdeteksi.
        </p>
        <p className="text-white/70 text-sm">
          Pastikan kamu sudah melengkapi data tim di halaman Teams.
        </p>
      </div>
    </div>
  );
}
