/**
 * UUID stage per kompetisi dari database backend.
 * Isi via environment variable NEXT_PUBLIC_STAGE_* di file .env.
 *
 * Contoh:
 *   NEXT_PUBLIC_STAGE_BCC_FINAL=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 *
 * Jika env var kosong, stage locking dinonaktifkan (semua stage terbuka).
 */
export const COMPETITION_STAGE_IDS = {
  BCC_PRELIMINARY: "d2d5efd5-2a42-4f09-9efb-9677a81b8ff9",
  BCC_FINAL: "032ad001-da13-4e57-9907-7c665578220a",

  PAPOS_PRELIMINARY: "295905c5-6853-4f4a-becf-551abc691676",
  PAPOS_FINAL:   "52467735-a17f-4247-bd5c-f0b59ece9e8a",

  GNG_PRELIMINARY: "b5bb1b74-3a05-4f5c-a5d2-f9a06a2c8d07",
  GNG_FINAL: "c83ca991-9e15-4fdd-a83c-1f7e8ab24c0b",

  ESSAY_PRELIMINARY: "d2da8f6e-6b6d-4294-b5fe-4dcda2d32182",
} as const;

/**
 * Apakah team sudah masuk ke final stage untuk kompetisi tertentu.
 * Jika finalStageId tidak dikonfigurasi, selalu return false (final tetap terbuka).
 */
export function isInFinalStage(currentStageId: string | null | undefined, finalStageId: string): boolean {
  if (!finalStageId) return false; // tidak dikonfigurasi → terkunci
  if (!currentStageId) return false;
  return currentStageId.trim().toLowerCase() === finalStageId.trim().toLowerCase();
}

/** Filter tahap di halaman committee submission */
export type CommitteeStageFilter = "all" | "preliminary" | "final";

export function getStagePairForSlug(slug: string | null): {
  preliminary: string | null;
  final: string | null;
} {
  switch (slug) {
    case "business-case":
      return { preliminary: COMPETITION_STAGE_IDS.BCC_PRELIMINARY, final: COMPETITION_STAGE_IDS.BCC_FINAL };
    case "paper-poster":
      return { preliminary: COMPETITION_STAGE_IDS.PAPOS_PRELIMINARY, final: COMPETITION_STAGE_IDS.PAPOS_FINAL };
    case "gng-case":
      return { preliminary: COMPETITION_STAGE_IDS.GNG_PRELIMINARY, final: COMPETITION_STAGE_IDS.GNG_FINAL };
    case "high-school-essay":
      return { preliminary: COMPETITION_STAGE_IDS.ESSAY_PRELIMINARY, final: null };
    default:
      return { preliminary: null, final: null };
  }
}

/** Label singkat untuk UI */
export function labelStageForTeam(
  currentStageId: string | null | undefined,
  slug: string | null
): "Preliminary" | "Final" | "—" {
  const { preliminary, final: fin } = getStagePairForSlug(slug);
  const id = (currentStageId ?? "").trim().toLowerCase();
  if (!id) return "—";
  if (preliminary && id === preliminary.toLowerCase()) return "Preliminary";
  if (fin && id === fin.toLowerCase()) return "Final";
  return "—";
}

export function teamMatchesCommitteeStageFilter(
  currentStageId: string | null | undefined,
  filter: CommitteeStageFilter,
  slug: string | null
): boolean {
  if (filter === "all") return true;
  const { preliminary, final: fin } = getStagePairForSlug(slug);
  const id = (currentStageId ?? "").trim().toLowerCase();
  if (!id) return false;
  if (filter === "preliminary") return !!(preliminary && id === preliminary.toLowerCase());
  if (filter === "final") return !!(fin && id === fin.toLowerCase());
  return true;
}
