/**
 * Contact person config untuk FAB di halaman dashboard.
 * LINE ID format: tanpa @ untuk URL (line.me/ti/p/~{id})
 */

export interface ContactPerson {
  id: string;
  name: string;
  lineId: string;
  /** URL LINE (line.me/ti/p/~{lineId}) */
  lineUrl?: string;
}

export interface ContactGroup {
  label: string;
  contacts: ContactPerson[];
}

export const CONTACT_GROUPS: Record<string, ContactGroup> = {
  "admin-it": {
    label: "Admin IT",
    contacts: [
      { id: "kuewaffle", name: "Andhika", lineId: "kuewaffle" },
      { id: "atharizza535", name: "Atharizza", lineId: "atharizza535" },
    ],
  },
  "admin-papos": {
    label: "Admin Competition Paper & Poster",
    contacts: [{ id: "fikritb26", name: "Fikri", lineId: "fikritb26" }],
  },
  "admin-gng": {
    label: "Admin Competition GnG Case Study",
    contacts: [{ id: "davinayas", name: "Davin", lineId: "davinayas" }],
  },
  "admin-bcc": {
    label: "Admin Competition BCC",
    contacts: [{ id: "tiaraaacl", name: "Tiara", lineId: "tiaraaacl" }],
  },
  "admin-essay": {
    label: "Admin Competition Essay",
    contacts: [{ id: "syifaaaauliaaaa", name: "Syifa", lineId: "syifaaaauliaaaa" }],
  },
  "admin-event": {
    label: "Admin Event",
    contacts: [{ id: "aurel", name: "Aurel", lineId: "aurelrosari" }],
  },
};

/** Path prefix → contact group key (lebih spesifik didahulukan) */
export const PATH_TO_CONTACT: Record<string, string> = {
  "/submission/papos": "admin-papos",
  "/submission/gng": "admin-gng",
  "/submission/bcc": "admin-bcc",
  "/submission/essay": "admin-essay",
  "/events": "admin-event",
  "/home": "admin-it",
  "/teams": "admin-it",
  "/administration": "admin-it",
  "/submission": "admin-it",
};

export function getContactGroupForPath(pathname: string): ContactGroup | null {
  for (const [prefix, key] of Object.entries(PATH_TO_CONTACT)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return CONTACT_GROUPS[key] ?? null;
    }
  }
  return null;
}

/** Semua grup kontak (IT, tiap kompetisi, event) untuk FAB di setiap halaman. */
export function getAllContactGroups(): ContactGroup[] {
  return [
    CONTACT_GROUPS["admin-it"],
    CONTACT_GROUPS["admin-papos"],
    CONTACT_GROUPS["admin-gng"],
    CONTACT_GROUPS["admin-bcc"],
    CONTACT_GROUPS["admin-essay"],
    CONTACT_GROUPS["admin-event"],
  ];
}

export function buildLineUrl(lineId: string): string {
  if (!lineId || lineId === "tba") return "#";
  return `https://line.me/ti/p/~${lineId}`;
}
