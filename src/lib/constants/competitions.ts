/**
 * Data tiap kompetisi (timeline, judul, dll.).
 * Dipakai di landing page dan participant home.
 */

/**
 * Peta competitionId → rute submission yang sesuai.
 * Dipakai oleh useSubmissionGuard untuk redirect peserta ke halaman yang benar.
 */
export const COMPETITION_SUBMISSION_ROUTES: Record<string, string> = {
  "business-case": "/submission/bcc",
  "gng-case": "/submission/gng",
  "high-school-essay": "/submission/essay",
  "paper-poster": "/submission/papos",
};
export interface CompetitionTimelineItem {
  label: string;
  date: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  timeline: CompetitionTimelineItem[];
  imageUrl: string;
}

export const COMPETITIONS: Competition[] = [
  {
    id: "paper-poster",
    title: "Paper & Poster Competition",
    description:
      "This competition is a manifestation platform of the Technology pillar for students to present real ideas and solutions through the development of geoscience technology, focusing on validating innovations that can expand the boundaries of oil and gas exploration.",
    timeline: [
      { label: "Early Registration", date: "13 - 22 March 2026" },
      { label: "Normal Registration", date: "23 - 31 Maret 2026" },
      { label: "Abstract Submission", date: "7 April 2026" },
      { label: "Finalist Announcement", date: "25 April 2026" },
      { label: "Final Technical Meeting I", date: "2 May 2026" },
      { label: "Full Paper & Poster Submission", date: "12 May 2026" },
      { label: "Final Technical Meeting II", date: "12 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ],
    imageUrl: "/PaPos.png",
  },
  {
    id: "business-case",
    title: "Business Case Competition",
    description:
      "An event for students to solve real business challenges in the energy sector, requiring participants to develop strategies that integrate profitability, ethics, and sustainability (Responsibility and Market Competition) in the industry.",
    timeline: [
      { label: "Early Registration", date: "14 - 21 March 2026" },
      { label: "Normal Registration", date: "22 March - 5 April 2026" },
      { label: "Preliminary Case Release", date: "13 April 2026" },
      { label: "Preliminary Case Submission", date: "11 May 2026" },
      { label: "Finalist Announcement", date: "21 May 2026" },
      { label: "Mentoring 1 on 1 Session", date: "23 May 2026" },
      { label: "Final Case Submission", date: "12 June 2026" },
      { label: "Final Technical Meeting", date: "14 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ],
    imageUrl: "/BCC.png",
  },
  {
    id: "gng-case",
    title: "GnG Case Study Competition",
    description:
      "A high-level technical competition embodying the pillars of Science and Technology, testing participants' ability to integrate geological and geophysical data to comprehensively solve exploration or field development challenges.",
    timeline: [
      { label: "Early Registration", date: "14 -21 March 2026" },
      { label: "Normal Registration", date: "22 March - 5 April 2026" },
      { label: "Prelimanary Case Release", date: "13 April 2026" },
      { label: "Prelimanary Case Submission", date: "11 May 2026" },
      { label: "Finalist Announcement", date: "21 May 2026" },
      { label: "Final Case Release & Software Training", date: "23 May 2026" },
      { label: "Final Case Submission", date: "12 June 2026" },
      { label: "Final Technical Meeting", date: "14 June 2026" },
      { label: "Final Pitching Day", date: "20 - 21 June 2026" },
    ],
    imageUrl: "/GnG%20Case%20Study.png",
  },
  {
    id: "high-school-essay",
    title: "High School Essay Competition",
    description:
      "This science literacy competition, open to high school students and equivalents, aims to spark critical thinking among young people about the role of energy, the world of geoscience, and how future innovations can ensure global energy security.",
    timeline: [
      { label: "Early Registration", date: "13 - 22 March 2026" },
      { label: "Normal Registration", date: "23March - 10 April 2026" },
      { label: "Essay Submission", date: "20 May 2026" },
      { label: "Finalist Announcement", date: "24 May 2026" },
      { label: "Final Technical Meeting", date: "19 June 2026" },
      { label: "Final Competition Day", date: "20 - 21 June 2026" },
    ],
    imageUrl: "/Essay.png",
  },
];
