"use client";

import { useState, useEffect } from "react";
import type { TeamStatus } from "@/lib/constants/team-status";

/**
 * Current team status for participant (Registered → Document Verified → Paid).
 * Replace with Supabase fetch when backend is ready.
 */
export function useTeamStatus(teamId: string | undefined) {
  const [status, setStatus] = useState<TeamStatus | null>(null);
  const [loading, setLoading] = useState(!!teamId);

  useEffect(() => {
    if (!teamId) {
      setStatus(null);
      setLoading(false);
      return;
    }
    // TODO: fetch from Supabase (services/supabase/teams.service)
    // const team = await getTeamById(teamId);
    // setStatus(team?.registration_status ?? null);
    setStatus("Registered");
    setLoading(false);
  }, [teamId]);

  return { status, loading };
}
