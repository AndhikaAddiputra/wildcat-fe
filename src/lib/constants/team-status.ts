/**
 * Team registration status flow for Participant role.
 * Transitions: Registered → Document Verified → Paid
 */
export const TEAM_STATUS = {
  REGISTERED: "Registered",
  DOCUMENT_VERIFIED: "Document Verified",
  PAID: "Paid",
} as const;

export type TeamStatus = (typeof TEAM_STATUS)[keyof typeof TEAM_STATUS];

/** Allowed transitions (from -> to) */
export const STATUS_TRANSITIONS: Record<TeamStatus, TeamStatus | null> = {
  [TEAM_STATUS.REGISTERED]: TEAM_STATUS.DOCUMENT_VERIFIED,
  [TEAM_STATUS.DOCUMENT_VERIFIED]: TEAM_STATUS.PAID,
  [TEAM_STATUS.PAID]: null,
};

export function canTransitionTo(current: TeamStatus, next: TeamStatus): boolean {
  return STATUS_TRANSITIONS[current] === next;
}

/**
 * Derive progress bar status dari documentVerificationStatus dan paymentVerificationStatus
 * (dari GET /api/landing/team).
 * - doc=Verified && pay=Verified → Paid
 * - doc=Verified && (pay=Pending || pay=Rejected) → Document Verified
 * - else → Registered
 */
export function deriveTeamStatusFromVerification(
  documentVerificationStatus?: string | null,
  paymentVerificationStatus?: string | null
): TeamStatus {
  const doc = (documentVerificationStatus ?? "").toLowerCase();
  const pay = (paymentVerificationStatus ?? "").toLowerCase();

  if (doc === "verified" && pay === "verified") {
    return TEAM_STATUS.PAID;
  }
  // doc=Verified + (pay not verified yet) → Document Verified
  // pay can be "", null, "pending", "rejected" when no payment or not yet verified
  if (doc === "verified") {
    return TEAM_STATUS.DOCUMENT_VERIFIED;
  }
  return TEAM_STATUS.REGISTERED;
}
