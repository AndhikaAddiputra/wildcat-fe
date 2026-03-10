import type { TeamProfileResponse, EventItem, AnnouncementItem } from "@/lib/api/types";

type Raw = Record<string, unknown>;

/**
 * Normalize response backend ke TeamProfileResponse.
 * Sesuai tabel team_accounts: id, team_name, institution, phone_number, line_id, lead_name, lead_major, m1_name, m1_major, m2_name, m2_major, competition_id, current_stage_id, created_at.
 */
export function normalizeTeamProfile(raw: Raw): TeamProfileResponse {
  const get = (camel: string, snake: string) =>
    (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined) ?? "";
  const getOpt = (camel: string, snake: string) => {
    const v = (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined);
    return v === undefined || v === null ? undefined : v;
  };
  const docStatus = getOpt("documentVerificationStatus", "document_verification_status");
  const payStatus = getOpt("paymentVerificationStatus", "payment_verification_status");
  const docRejectNotes = getOpt("documentRejectionNotes", "document_rejection_notes") ?? (getOpt("rejectionNotes", "rejection_notes") as string | undefined);

  return {
    teamId: get("teamId", "team_id") || (raw.id as string) || "unknown",
    teamName: get("teamName", "team_name") || "",
    institution: getOpt("institution", "institution"),
    phoneNumber: getOpt("phoneNumber", "phone_number"),
    lineId: getOpt("lineId", "line_id"),
    leadName: get("leadName", "lead_name") || "",
    leadMajor: getOpt("leadMajor", "lead_major"),
    m1Name: getOpt("m1Name", "m1_name") ?? undefined,
    m1Major: getOpt("m1Major", "m1_major") ?? undefined,
    m2Name: getOpt("m2Name", "m2_name") ?? undefined,
    m2Major: getOpt("m2Major", "m2_major") ?? undefined,
    competitionId: getOpt("competitionId", "competition_id"),
    currentStageId: getOpt("currentStageId", "current_stage_id") ?? undefined,
    createdAt: getOpt("createdAt", "created_at"),
    documentVerificationStatus: docStatus ?? undefined,
    paymentVerificationStatus: payStatus ?? undefined,
    documentRejectionNotes: docRejectNotes ?? undefined,
  };
}

/**
 * Normalize response backend ke EventItem.
 * Sesuai tabel events: id, name, datetime, location, speaker, registration_link, is_published.
 */
export function normalizeEvent(raw: Raw): EventItem {
  const get = (camel: string, snake: string) =>
    (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined) ?? "";
  const getOpt = (camel: string, snake: string) =>
    (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined);
  const isPublished = (raw.isPublished as boolean | undefined) ?? (raw.is_published as boolean | undefined);
  return {
    id: (raw.id as string) ?? "",
    name: get("name", "name"),
    description: getOpt("description", "description") ?? undefined,
    datetime: get("datetime", "datetime"),
    location: get("location", "location") || "TBA",
    speaker: getOpt("speaker", "speaker") ?? undefined,
    registrationLink: get("registrationLink", "registration_link") || "",
    isPublished,
    status: raw.status as EventItem["status"],
  };
}

/**
 * Normalize response backend ke AnnouncementItem.
 * API: id, title, content, target_audience, attachment_url, created_at (ordered newest first).
 */
export function normalizeAnnouncement(raw: Raw): AnnouncementItem {
  const get = (camel: string, snake: string) =>
    (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined) ?? "";
  const getOpt = (camel: string, snake: string) =>
    (raw[camel] as string | undefined) ?? (raw[snake] as string | undefined);
  return {
    id: (raw.id as string) ?? "",
    title: get("title", "title"),
    content: get("content", "content"),
    targetAudience: getOpt("targetAudience", "target_audience") ?? undefined,
    attachmentUrl: getOpt("attachmentUrl", "attachment_url") ?? undefined,
    createdAt: getOpt("createdAt", "created_at") ?? undefined,
  };
}
