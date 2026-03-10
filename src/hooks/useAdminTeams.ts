"use client";

import { useState, useEffect, useCallback } from "react";

export interface TeamDocument {
  type: string;
  url: string | null;
  exists: boolean;
}

export interface AdminTeam {
  teamId: string;
  teamName: string;
  institution: string;
  competition: string;
  documents: TeamDocument[];
  verificationStatus: "Pending" | "Verified" | "Rejected";
  verifiedBy: string | null;
  rejectionNotes: string | null;
}

interface AdminTeamsResponse {
  teams?: AdminTeam[];
}

/**
 * Hook untuk mengambil semua tim beserta dokumen administrasi mereka.
 * Menggunakan GET /api/admin/documents/teams.
 */
export function useAdminTeams() {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/documents/teams", { credentials: "include" });
      const data = (await res.json().catch(() => ({}))) as AdminTeamsResponse & { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Failed to load team data");
        setTeams([]);
      } else {
        setTeams(data.teams ?? []);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load team data");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  /**
   * Verify atau Reject satu tim.
   * Mengembalikan { error: string } jika gagal, atau { actualAction: "Verified" | "Rejected" } jika sukses.
   * actualAction diambil dari response backend (bisa auto-reject jika dokumen tidak lengkap).
   */
  const verifyTeam = useCallback(
    async (
      teamId: string,
      action: "Verified" | "Rejected",
      rejectionNotes?: string
    ): Promise<{ error: string } | { actualAction: "Verified" | "Rejected" }> => {
      // Optimistic update
      setTeams((prev) =>
        prev.map((t) =>
          t.teamId === teamId
            ? {
                ...t,
                verificationStatus: action,
                rejectionNotes: rejectionNotes ?? t.rejectionNotes,
              }
            : t
        )
      );
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ teamId, action, rejectionNotes }),
        });
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
          error?: string;
          verificationStatus?: string;
          verification_status?: string;
          documentRejectionNotes?: string;
          rejectionNotes?: string;
        };
        if (!res.ok) {
          await refetch(); // rollback
          return { error: (data.error as string) ?? `Failed: ${res.status}` };
        }
        const rawStatus =
          data.verificationStatus ??
          data.verification_status ??
          (typeof data.team === "object" && data.team && "verificationStatus" in data.team
            ? (data.team as { verificationStatus?: string }).verificationStatus
            : null) ??
          (typeof data.data === "object" && data.data && "verificationStatus" in data.data
            ? (data.data as { verificationStatus?: string }).verificationStatus
            : null);
        const actualAction =
          String(rawStatus ?? action).toLowerCase() === "rejected" ? "Rejected" : "Verified";
        const nested = typeof data.data === "object" && data.data ? (data.data as Record<string, unknown>) : data;
        const rejectionNotesFromBackend = (
          data.documentRejectionNotes ??
          data.rejectionNotes ??
          (data as Record<string, unknown>).document_rejection_notes ??
          (data as Record<string, unknown>).rejection_notes ??
          nested.documentRejectionNotes ??
          nested.rejectionNotes ??
          ""
        )
          .toString()
          .trim();
        const isAutoReject =
          action === "Verified" &&
          (actualAction === "Rejected" || !!rejectionNotesFromBackend);
        if (isAutoReject) {
          const notes = rejectionNotesFromBackend;
          setTeams((prev) =>
            prev.map((t) =>
              t.teamId === teamId
                ? {
                    ...t,
                    verificationStatus: "Rejected" as const,
                    rejectionNotes: notes || null,
                  }
                : t
            )
          );
          return {
            error: notes || "Documents incomplete. Team automatically rejected.",
          };
        }
        if (actualAction !== action) await refetch();
        return { actualAction };
      } catch (e) {
        await refetch(); // rollback
        return {
          error: e instanceof Error ? e.message : "Failed to reach server",
        };
      }
    },
    [refetch]
  );

  return { teams, loading, error, refetch, verifyTeam };
}
