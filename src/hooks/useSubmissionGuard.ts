"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamProfile } from "@/hooks/useTeamProfile";
import { COMPETITION_SUBMISSION_ROUTES } from "@/lib/constants/competitions";
import { competitionUuidToId } from "@/lib/constants/guidebooks";

/**
 * Guard untuk halaman submission — memastikan peserta hanya bisa mengakses
 * halaman submission yang sesuai dengan kompetisi yang mereka ikuti.
 *
 * @param pageCompetitionId - competitionId milik halaman ini (mis. "business-case")
 *
 * Jika `competitionId` tim tidak cocok, peserta akan di-redirect ke halaman yang benar.
 * Selama pengecekan berlangsung, `checking` bernilai true sehingga halaman bisa
 * menampilkan loading state dan menghindari flash konten yang tidak seharusnya.
 */
export function useSubmissionGuard(pageCompetitionId: string) {
  const router = useRouter();
  const { data, loading } = useTeamProfile();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    const rawId = data?.competitionId;

    if (!rawId) {
      // Tim belum punya kompetisi — biarkan halaman render (bisa tampilkan pesan sendiri)
      setChecking(false);
      return;
    }

    // competitionId dari DB adalah UUID — konversi ke string ID ("business-case", dll.)
    const competitionId = competitionUuidToId(rawId) ?? rawId;
    const correctRoute = COMPETITION_SUBMISSION_ROUTES[competitionId];
    const currentRoute = COMPETITION_SUBMISSION_ROUTES[pageCompetitionId];

    if (!correctRoute) {
      // UUID tidak dikenali — jangan blokir, biarkan halaman render
      setChecking(false);
      return;
    }

    if (correctRoute !== currentRoute) {
      router.replace(correctRoute);
      // Jangan setChecking(false) — halaman tidak boleh flash sebelum redirect selesai
    } else {
      setChecking(false);
    }
  }, [loading, data, pageCompetitionId, router]);

  return { checking: loading || checking };
}
