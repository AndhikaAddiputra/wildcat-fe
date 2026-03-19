"use client";

import { TeamsExportTable } from "@/components/admin/TeamsExportTable";
import { LOGO, COMMITTEE_NAV_LINKS, COMMITTEE_NAV_ACTION } from "@/config/navbar-config";

export default function CommitteeTeamsExportPage() {
  return (
    <TeamsExportTable
      title="Export Teams Data"
      navLinks={COMMITTEE_NAV_LINKS}
      activeLink="/committee/export/teams"
      navAction={COMMITTEE_NAV_ACTION}
      logo={LOGO}
    />
  );
}
