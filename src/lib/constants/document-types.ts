/**
 * Document types for the upload API (sign/confirm).
 * Must match backend expectations.
 */
export const DOCUMENT_TYPES = {
  // Administration
  LEAD_KTM: "lead_ktm",
  MEMBER_KTM_1: "member_ktm_1",
  MEMBER_KTM_2: "member_ktm_2",
  PROOF_TWIBBON: "proof_twibbon",
  PROOF_POSTER_IG: "proof_poster_ig",
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
