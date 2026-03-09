/**
 * Role-Based Access Control (RBAC) constants.
 * Used by middleware and hooks to restrict routes by role.
 */
export const ROLES = {
  PARTICIPANT: "participant",
  COMMITTEE: "committee",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Routes that require no auth (public) */
export const PUBLIC_PATHS = ["/", "/landing", "/login", "/register", "/auth/callback"] as const;

/** Path prefixes per role (dashboard routes) */
export const PARTICIPANT_PREFIXES = ["/home", "/teams", "/administration", "/events", "/submission"];
export const COMMITTEE_PREFIXES = ["/committee"];
export const ADMIN_PREFIXES = ["/admin"];

export function isParticipantPath(pathname: string): boolean {
  return PARTICIPANT_PREFIXES.some((p) => pathname.startsWith(p));
}
export function isCommitteePath(pathname: string): boolean {
  return pathname.startsWith("/committee");
}
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}
