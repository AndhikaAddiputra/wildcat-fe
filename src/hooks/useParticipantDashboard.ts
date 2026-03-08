"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import type { CheckRegistrationResponse } from "@/lib/api/types";
import type { TeamStatus } from "@/lib/constants/team-status";

export interface ParticipantDashboardData {
  registered: boolean;
  isCompleted: boolean;
  teamName: string | null;
  leaderName: string | null;
  status: TeamStatus | null;
}

const DB_ERROR_MESSAGE =
  "Koneksi database sibuk. Silakan muat ulang halaman atau coba lagi.";

function isDbQueryError(message: string): boolean {
  return /Failed query|ECONNREFUSED|connection|timeout/i.test(message);
}

/**
 * Fetch data untuk dashboard participant (home): status registrasi, nama tim, nama leader.
 * Menggunakan GET /api/landing/check-registration.
 */
export function useParticipantDashboard() {
  const [data, setData] = useState<ParticipantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetchWithAuth("/api/landing/check-registration");
        const json = (await res.json().catch(() => ({}))) as CheckRegistrationResponse & {
          team_name?: string;
          lead_name?: string;
          leadName?: string;
          leader_name?: string;
          error?: string;
        };
        if (!res.ok) {
          const errMsg = json?.error || "Gagal memuat data dashboard";
          if (isDbQueryError(errMsg) && attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
          setError(isDbQueryError(errMsg) ? DB_ERROR_MESSAGE : errMsg);
          setData(null);
          setLoading(false);
          return;
        }
        // DB team_accounts: team_name, lead_name (bukan leader_name)
        const teamName = json.teamName ?? json.team_name ?? null;
        const leaderName = json.leadName ?? json.lead_name ?? json.leaderName ?? json.leader_name ?? null;
        const status = (json.status as TeamStatus) ?? (json.registered ? "Registered" : null);
        setData({
          registered: json.registered === true,
          isCompleted: json.isCompleted === true,
          teamName,
          leaderName,
          status: status ?? null,
        });
        setLoading(false);
        return;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Gagal memuat data";
        if (isDbQueryError(msg) && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        setError(isDbQueryError(msg) ? DB_ERROR_MESSAGE : msg);
        setData(null);
        break;
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
