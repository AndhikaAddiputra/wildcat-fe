/**
 * Mapping dari jenis dokumen submission ke `requirement_id` (UUID dari database backend).
 *
 * Isi via environment variable NEXT_PUBLIC_REQ_* di file .env (atau .env.local).
 * Contoh:
 *   NEXT_PUBLIC_REQ_BUSINESS_PROPOSAL=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 */
export const SUBMISSION_REQUIREMENTS = {
  // BCC – Business Case Competition
  BUSINESS_PROPOSAL: process.env.NEXT_PUBLIC_REQ_BUSINESS_PROPOSAL ?? "",
  PITCH_DECK: process.env.NEXT_PUBLIC_REQ_PITCH_DECK ?? "",

  // PaPos – Paper & Poster
  EXTENDED_ABSTRACT: process.env.NEXT_PUBLIC_REQ_EXTENDED_ABSTRACT ?? "",
  FULL_PAPER: process.env.NEXT_PUBLIC_REQ_FULL_PAPER ?? "",
  POSTER: process.env.NEXT_PUBLIC_REQ_POSTER ?? "",

  // GnG – Geology & Geophysics Case Study
  TECHNICAL_ESSAY: "33734cb5-9892-4704-967c-6e3bca8ae543",
  TECHNICAL_REPORT: "ce7e2eac-16bc-4c89-9600-b1c30b2f957a",

  // Essay – High School Essay
  ESSAY_ABSTRACT: "9f23c829-e3ad-424a-a9a3-5ef1e2099604",
  FULL_ESSAY: "b10162fe-5769-4311-a938-c696cd3d2db7",
} as const;

export type SubmissionRequirementKey = keyof typeof SUBMISSION_REQUIREMENTS;
