"use client";

import { TeamsExportTable } from "@/components/admin/TeamsExportTable";
import { LOGO, ADMIN_NAV_LINKS, ADMIN_NAV_ACTION } from "@/config/navbar-config";

export default function AdminTeamsExportPage() {
  return (
    <TeamsExportTable
      title="Export Teams Data"
      navLinks={ADMIN_NAV_LINKS}
      activeLink="/admin/export/teams"
      navAction={ADMIN_NAV_ACTION}
      logo={LOGO}
    />
  );
}
