/**
 * Link RSVP/registrasi per event.
 * Event id: field-trip, grand-seminar, wishare, webinar, dll.
 */
export const EVENT_REGISTRATION_LINKS: Record<string, string> = {
  "field-trip": "https://forms.gle/9bi8FgfTKzx5HATB7",
  "grand-seminar": "https://docs.google.com/forms/d/e/1FAIpQLScv_-NILyLs_4g0_4UophBLPLF5nb3svprk4_UPFyBa4psAVg/viewform?usp=publish-editor",
  "wishare": "https://forms.gle/RbpSkewns9YyWFw57",
};

export function getEventRegistrationLink(eventId: string): string | undefined {
  const normalized = eventId?.toLowerCase().trim();
  return EVENT_REGISTRATION_LINKS[normalized];
}
