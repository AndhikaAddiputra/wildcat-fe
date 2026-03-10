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
