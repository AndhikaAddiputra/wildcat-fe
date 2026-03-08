/**
 * URL guidebook per kompetisi: https://storage.wildcat2026.com/guidebooks/<id>.pdf
 * Papos, BCC, GnG, Essay.
 */
const GUIDEBOOK_BASE = "https://storage.wildcat2026.com/guidebooks";

const GUIDEBOOK_IDS = {
  "paper-poster": "77597754-e64c-402d-a71f-a359a39be953", // Papos
  "business-case": "9a493de9-4b3f-45f2-aa51-c43d29882738", // BCC
  "gng-case": "a1baa39c-5806-42c5-8762-23613344f6fe", // GnG
  "high-school-essay": "a83cf52f-08fe-47ca-8e43-ae8c1f8b78ce", // Essay
} as const;

export type GuidebookCompetitionId = keyof typeof GUIDEBOOK_IDS;

/** Map UUID (dari backend/DB) ke id frontend. */
const UUID_TO_COMPETITION_ID: Record<string, GuidebookCompetitionId> = {
  [GUIDEBOOK_IDS["paper-poster"]]: "paper-poster",
  [GUIDEBOOK_IDS["business-case"]]: "business-case",
  [GUIDEBOOK_IDS["gng-case"]]: "gng-case",
  [GUIDEBOOK_IDS["high-school-essay"]]: "high-school-essay",
};

export function competitionUuidToId(uuid: string | null | undefined): GuidebookCompetitionId | null {
  if (!uuid) return null;
  const normalized = uuid.trim().toLowerCase();
  return UUID_TO_COMPETITION_ID[normalized] ?? null;
}

export const GUIDEBOOK_URLS: Record<GuidebookCompetitionId, string> = {
  "paper-poster": `${GUIDEBOOK_BASE}/${GUIDEBOOK_IDS["paper-poster"]}.pdf`,
  "business-case": `${GUIDEBOOK_BASE}/${GUIDEBOOK_IDS["business-case"]}.pdf`,
  "gng-case": `${GUIDEBOOK_BASE}/${GUIDEBOOK_IDS["gng-case"]}.pdf`,
  "high-school-essay": `${GUIDEBOOK_BASE}/${GUIDEBOOK_IDS["high-school-essay"]}.pdf`,
};

export function getGuidebookUrl(
  competitionId: GuidebookCompetitionId | string
): string {
  const url = GUIDEBOOK_URLS[competitionId as GuidebookCompetitionId];
  return url ?? GUIDEBOOK_URLS["paper-poster"];
}

export function getGuidebooksList(): {
  id: GuidebookCompetitionId;
  name: string;
  url: string;
}[] {
  const labels: Record<GuidebookCompetitionId, string> = {
    "paper-poster": "Paper and Poster (Papos)",
    "business-case": "Business Case (BCC)",
    "gng-case": "Geology and Geophysics Case Study (GnG)",
    "high-school-essay": "Highschool Essay",
  };
  return (Object.keys(GUIDEBOOK_URLS) as GuidebookCompetitionId[]).map(
    (id) => ({
      id,
      name: labels[id],
      url: GUIDEBOOK_URLS[id],
    })
  );
}
