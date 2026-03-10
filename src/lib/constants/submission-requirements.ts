/**
 * Mapping dari jenis dokumen submission ke `requirement_id` (UUID dari database backend).
 *
 * Isi via environment variable NEXT_PUBLIC_REQ_* di file .env (atau .env.local).
 * Contoh:
 *   NEXT_PUBLIC_REQ_BUSINESS_PROPOSAL=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export const SUBMISSION_REQUIREMENTS = {
  // BCC – Business Case Competition
  BUSINESS_PROPOSAL: "e7064c5d-5ad8-4f6d-974a-ae51f6eb0e27",
  PITCH_DECK: "0c81384f-e5bb-4209-aefa-5bc399daa58d",

  // PaPos – Paper & Poster
  EXTENDED_ABSTRACT: "9e0e20e2-8cde-40bd-aaf5-3e10a8f90c21",
  FULL_PAPER: "42dbfc10-d95e-4923-90b7-f764327dc70f",
  POSTER: "27aa3bde-ce36-4e7c-9872-f8e93bb6d580",

  // GnG – Geology & Geophysics Case Study
  TECHNICAL_ESSAY: "33734cb5-9892-4704-967c-6e3bca8ae543",
  TECHNICAL_REPORT: "ce7e2eac-16bc-4c89-9600-b1c30b2f957a",

  // Essay – High School Essay
  ESSAY_ABSTRACT: "9f23c829-e3ad-424a-a9a3-5ef1e2099604",
  FULL_ESSAY: "b10162fe-5769-4311-a938-c696cd3d2db7",
} as const;

export type SubmissionRequirementKey = keyof typeof SUBMISSION_REQUIREMENTS;

/**
 * Kolom dokumen per kompetisi untuk halaman committee submission.
 * Dipakai ketika competition.teams kosong (0 tim) sehingga kolom tidak bisa di-derive dari data.
 */
export const COMPETITION_DOCUMENT_COLUMNS: Record<
  string,
  { requirementId: string; documentName: string }[]
> = {
  "business-case": [
    { requirementId: SUBMISSION_REQUIREMENTS.BUSINESS_PROPOSAL, documentName: "Business Proposal" },
    { requirementId: SUBMISSION_REQUIREMENTS.PITCH_DECK, documentName: "Pitch Deck" },
  ],
  "paper-poster": [
    { requirementId: SUBMISSION_REQUIREMENTS.EXTENDED_ABSTRACT, documentName: "Extended Abstract" },
    { requirementId: SUBMISSION_REQUIREMENTS.FULL_PAPER, documentName: "Full Paper" },
    { requirementId: SUBMISSION_REQUIREMENTS.POSTER, documentName: "Poster" },
  ],
  "gng-case": [
    { requirementId: SUBMISSION_REQUIREMENTS.TECHNICAL_ESSAY, documentName: "Technical Essay" },
    { requirementId: SUBMISSION_REQUIREMENTS.TECHNICAL_REPORT, documentName: "Technical Report" },
  ],
  "high-school-essay": [
    { requirementId: SUBMISSION_REQUIREMENTS.ESSAY_ABSTRACT, documentName: "Essay Abstract" },
    { requirementId: SUBMISSION_REQUIREMENTS.FULL_ESSAY, documentName: "Full Essay" },
  ],
};

/** Derive competition slug dari competitionName untuk lookup kolom dokumen. */
export function getCompetitionSlugFromName(name: string | null | undefined): string | null {
  if (!name || typeof name !== "string") return null;
  const n = name.toLowerCase().trim();
  if (n.includes("business case") || n.includes("bcc")) return "business-case";
  if (n.includes("paper") && n.includes("poster") || n.includes("papos")) return "paper-poster";
  if (n.includes("geology") && n.includes("geophysics") || n.includes("gng")) return "gng-case";
  if (n.includes("essay") || n.includes("high school")) return "high-school-essay";
  return null;
}
