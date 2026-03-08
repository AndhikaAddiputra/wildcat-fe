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
  BCC_PRELIMINARY: process.env.NEXT_PUBLIC_STAGE_BCC_PRELIMINARY ?? "",
  BCC_FINAL:       process.env.NEXT_PUBLIC_STAGE_BCC_FINAL       ?? "",

  PAPOS_PRELIMINARY: process.env.NEXT_PUBLIC_STAGE_PAPOS_PRELIMINARY ?? "",
  PAPOS_FINAL:       process.env.NEXT_PUBLIC_STAGE_PAPOS_FINAL       ?? "",

  GNG_PRELIMINARY: process.env.NEXT_PUBLIC_STAGE_GNG_PRELIMINARY ?? "",
  GNG_FINAL:       process.env.NEXT_PUBLIC_STAGE_GNG_FINAL       ?? "",

  ESSAY_PRELIMINARY: process.env.NEXT_PUBLIC_STAGE_ESSAY_PRELIMINARY ?? "",
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
