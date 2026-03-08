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
