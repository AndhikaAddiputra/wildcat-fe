/**
 * Document types for the upload API (sign/confirm).
 * Must match backend expectations.
 */
export const DOCUMENT_TYPES = {
  // Administration — nilai harus match backend: lead_ktm, m1_ktm, m2_ktm, twibbon_proof, poster_proof
  LEAD_KTM: "lead_ktm",
  MEMBER_KTM_1: "m1_ktm",
  MEMBER_KTM_2: "m2_ktm",
  PROOF_TWIBBON: "twibbon_proof",
  PROOF_POSTER_IG: "poster_proof",
  PAYMENT_PROOF: "payment_proof",
  // Submission BCC
  BUSINESS_PROPOSAL: "business_proposal",
  PITCH_DECK: "pitch_deck",
  // Submission PaPos
  EXTENDED_ABSTRACT: "extended_abstract",
  FULL_PAPER: "full_paper",
  POSTER: "poster",
  // Submission GnG
  TECHNICAL_ESSAY: "technical_essay",
  TECHNICAL_REPORT: "technical_report",
  // Submission Essay
  ESSAY_ABSTRACT: "essay_abstract",
  FULL_ESSAY: "full_essay",
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];
