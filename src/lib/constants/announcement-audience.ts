/**
 * Nilai enum target_audience yang diterima backend untuk announcements.
 * ⚠️  Sesuaikan string value-nya dengan enum yang ada di BE jika belum cocok.
 *     Hanya ubah string di bagian kanan (value), bukan key-nya.
 */
export const ANNOUNCEMENT_AUDIENCE = {
  ALL: "All",
  PAPOS: "PaPos",
  BCC: "BCC",
  GNG: "GnG",
  ESSAY: "Essay",
} as const;

export type AnnouncementAudience =
  (typeof ANNOUNCEMENT_AUDIENCE)[keyof typeof ANNOUNCEMENT_AUDIENCE];

/** Label yang ditampilkan di UI untuk tiap nilai audience */
export const ANNOUNCEMENT_AUDIENCE_LABEL: Record<AnnouncementAudience, string> = {
  [ANNOUNCEMENT_AUDIENCE.ALL]: "All Participants",
  [ANNOUNCEMENT_AUDIENCE.PAPOS]: "Paper & Poster",
  [ANNOUNCEMENT_AUDIENCE.BCC]: "Business Case",
  [ANNOUNCEMENT_AUDIENCE.GNG]: "GnG Case Study",
  [ANNOUNCEMENT_AUDIENCE.ESSAY]: "High School Essay",
};

export const ANNOUNCEMENT_AUDIENCE_OPTIONS = Object.entries(
  ANNOUNCEMENT_AUDIENCE_LABEL
).map(([value, label]) => ({ value: value as AnnouncementAudience, label }));
