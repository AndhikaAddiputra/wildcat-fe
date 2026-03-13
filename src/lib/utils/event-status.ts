/**
 * Status event: available (H-14), not_started, ended.
 * - Webinar: selalu "ended"
 * - Lainnya: available = 2 minggu sebelum event, ended = setelah event
 */

export type EventStatus = "available" | "not_started" | "ended";

/**
 * Parse tanggal dari string seperti "14 March 2026", "11 April 2026".
 */
function parseEventDate(dateStr: string): Date | null {
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Hitung status event berdasarkan tanggal dan id.
 * - webinar: selalu "ended"
 * - H-14: status "available" 2 minggu sebelum event
 * - Setelah event: "ended"
 */
export function computeEventStatus(eventId: string, eventDateStr: string): EventStatus {
  if (eventId.toLowerCase().includes("webinar")) return "ended";

  const eventDate = parseEventDate(eventDateStr);
  if (!eventDate) return "not_started";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffMs = eventDate.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "ended";
  if (diffDays <= 14) return "available";
  return "not_started";
}
