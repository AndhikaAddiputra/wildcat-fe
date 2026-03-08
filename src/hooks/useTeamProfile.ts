"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { normalizeTeamProfile } from "@/lib/api/normalize";
import type { TeamProfileResponse, RegisterCompleteBody } from "@/lib/api/types";

const DB_ERROR_MESSAGE =
  "Koneksi database sibuk. Silakan muat ulang halaman atau coba lagi.";

function isDbQueryError(message: string): boolean {
  return /Failed query|ECONNREFUSED|connection|timeout/i.test(message);
}

/**
 * Fetch dan update team profile (halaman Teams).
 * - GET /api/landing/team → data tim (via Next.js API, proxy ke backend).
 * - POST /api/landing/register/complete → simpan/update tim (body sesuai API).
 */
export function useTeamProfile() {
  const [data, setData] = useState<TeamProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const maxAttempts = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const res = await fetchWithAuth("/api/landing/team");
        if (res.status === 404) {
          setData(null);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          const text = await res.text();
          let errMsg = text || "Gagal memuat data tim";
          try {
            const parsed = JSON.parse(text) as { error?: string };
            if (parsed?.error) errMsg = parsed.error;
          } catch {
            /* use errMsg as is */
          }
          lastError = new Error(errMsg);
          if (isDbQueryError(errMsg) && attempt < maxAttempts) {
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
          if (isDbQueryError(errMsg)) {
            lastError = new Error(DB_ERROR_MESSAGE);
          }
          throw lastError;
        }
        const json = await res.json();
        setData(normalizeTeamProfile(json as Record<string, unknown>));
        setLoading(false);
        return;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("Gagal memuat data tim");
        if (attempt < maxAttempts && isDbQueryError(lastError.message)) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        setError(lastError.message);
        setData(null);
        break;
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const updateTeam = useCallback(
    async (body: Partial<TeamProfileResponse>) => {
      const prev = data;
      const competitionId = body.competitionId ?? prev?.competitionId ?? "";
      const teamName = body.teamName ?? prev?.teamName ?? "";
      const leadName = body.leadName ?? prev?.leadName ?? "";
      const institution = body.institution ?? prev?.institution ?? "";
      const leadMajor = body.leadMajor ?? prev?.leadMajor ?? "";
      const phoneNumber = body.phoneNumber ?? prev?.phoneNumber ?? "";
      const lineId = body.lineId ?? prev?.lineId ?? "";

      if (
        !competitionId ||
        !teamName ||
        !leadName ||
        !institution ||
        !leadMajor ||
        !phoneNumber ||
        !lineId
      ) {
        throw new Error(
          "Team Name, Leader Name, Institution, Leader Major, Phone Number, and Line ID must be filled"
        );
      }

      const payload: RegisterCompleteBody = {
        competitionId,
        teamName,
        leadName,
        institution,
        leadMajor,
        phoneNumber,
        lineId,
        m1Name: body.m1Name ?? prev?.m1Name ?? undefined,
        m1Major: body.m1Major ?? prev?.m1Major ?? undefined,
        m2Name: body.m2Name ?? prev?.m2Name ?? undefined,
        m2Major: body.m2Major ?? prev?.m2Major ?? undefined,
      };

      const maxAttempts = 2;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const res = await fetchWithAuth("/api/landing/register/complete", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const errData = await res.json().catch(() => ({}));
        const errMsg = (errData as { error?: string }).error || "Gagal menyimpan";

        if (res.ok) {
          const result = errData as { teamId: string; created: boolean };
          await refetch();
          return result;
        }

        lastError = new Error(isDbQueryError(errMsg) ? DB_ERROR_MESSAGE : errMsg);
        if (isDbQueryError(errMsg) && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        throw lastError;
      }

      throw lastError ?? new Error("Gagal menyimpan");
    },
    [data, refetch]
  );

  return { data, loading, error, refetch, updateTeam };
}
