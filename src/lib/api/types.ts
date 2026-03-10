/**
 * Tipe response API sesuai skema database (team_accounts, events, announcements, dll).
 * Backend bisa mengembalikan camelCase (Drizzle) atau snake_case (raw DB); gunakan normalizer di hooks.
 */

// ==========================================
// CHECK REGISTRATION (derived dari team_accounts + team_administration + transactions)
// ==========================================

export interface CheckRegistrationResponse {
  registered: boolean;
  isCompleted?: boolean;
  /** team_accounts.id (uuid) */
  teamId?: string;
  teamName?: string;
  leaderName?: string;
  /** "Registered" | "Document Verified" | "Paid" (computed dari stage/verification) */
  status?: string;
  // snake_case dari DB (team_accounts: team_name, lead_name)
  team_name?: string;
  leader_name?: string;
  lead_name?: string;
  leadName?: string;
  /** Catatan penolakan dokumen dari committee */
  documentRejectionNotes?: string | null;
  document_rejection_notes?: string | null;
}

// ==========================================
// TEAM PROFILE — table team_accounts
// ==========================================

export interface TeamProfileResponse {
  /** team_accounts.id (uuid, PK = auth user id) */
  teamId: string;
  teamName: string;
  institution?: string;
  phoneNumber?: string;
  lineId?: string;
  leadName: string;
  leadMajor?: string;
  m1Name?: string | null;
  m1Major?: string | null;
  m2Name?: string | null;
  m2Major?: string | null;
  competitionId?: string;
  currentStageId?: string | null;
  createdAt?: string;
  /** "Pending" | "Verified" | "Rejected" — untuk progress bar */
  documentVerificationStatus?: string;
  /** "Pending" | "Verified" | "Rejected" — untuk progress bar */
  paymentVerificationStatus?: string;
  /** Catatan penolakan dokumen dari committee (saat documentVerificationStatus = Rejected) */
  documentRejectionNotes?: string | null;
}

/** Body untuk POST /api/landing/register/complete */
export interface RegisterCompleteBody {
  competitionId: string;
  teamName: string;
  leadName: string;
  institution: string;
  leadMajor: string;
  phoneNumber: string;
  lineId: string;
  m1Name?: string;
  m1Major?: string;
  m2Name?: string;
  m2Major?: string;
}

/** Response POST /api/landing/register/complete */
export interface RegisterCompleteResponse {
  teamId: string;
  created: boolean;
}

// ==========================================
// EVENTS — table events
// ==========================================

export interface EventItem {
  id: string;
  name: string;
  /** Tidak ada di schema DB; bisa dari app_content atau null */
  description?: string | null;
  datetime: string;
  location: string;
  speaker?: string | null;
  registrationLink: string;
  isPublished?: boolean;
  /** UI-only: derived dari datetime */
  status?: "available" | "not_started" | "ended";
}

// ==========================================
// ANNOUNCEMENTS — GET /api/announcements
// ==========================================
// Response: array of announcement objects, ordered by created_at (newest first).
// Authenticated: target_audience = "All" OR user's competition name.
// Unauthenticated: target_audience = "All" only.

import type { AnnouncementAudience } from "@/lib/constants/announcement-audience";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  /**
   * Nilai enum target_audience dari backend.
   * Lihat ANNOUNCEMENT_AUDIENCE di lib/constants/announcement-audience.ts.
   */
  targetAudience?: AnnouncementAudience | string;
  attachmentUrl?: string | null;
  /** ISO timestamp */
  createdAt?: string;
}

/** Body untuk POST/PUT /api/admin/announcements */
export interface AnnouncementUpsertBody {
  title: string;
  content: string;
  /** Harus salah satu dari ANNOUNCEMENT_AUDIENCE */
  targetAudience: AnnouncementAudience;
  attachmentUrl?: string;
  /** Hanya ada saat update — ID announcement yang diedit */
  id?: string;
}
