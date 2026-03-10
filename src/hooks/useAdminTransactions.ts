"use client";

import { useState, useEffect, useCallback } from "react";

export interface AdminTransaction {
  id: string;
  teamId: string;
  teamName: string;
  institution?: string;
  competition: string;
  amount: string;
  paymentType: string;
  paymentProofUrl: string | null;
  /** Signed URL for committee to view proof (if backend provides) */
  proofSignedUrl?: string | null;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  rejectionNotes: string | null;
  createdAt: string;
}

function pick(obj: Record<string, unknown> | null | undefined, ...keys: string[]): unknown {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    if (k in obj && obj[k] != null) return obj[k];
  }
  return undefined;
}

function normalizeTransaction(raw: Record<string, unknown>): AdminTransaction {
  const d = raw?.data ?? raw;
  const inner = (typeof d === "object" && d !== null ? d : raw) as Record<string, unknown>;
  const team = (inner?.team ?? raw?.team) as Record<string, unknown> | null | undefined;

  const teamName =
    (pick(inner, "teamName", "team_name", "name") as string) ??
    (pick(raw, "teamName", "team_name") as string) ??
    (pick(team, "name", "teamName", "team_name") as string) ??
    "";

  const competition =
    (pick(inner, "competitionName", "competition", "competition_name", "category") as string) ??
    (pick(raw, "competitionName", "competition", "competition_name") as string) ??
    (pick(team, "competitionName", "competition", "competition_name") as string) ??
    "";

  const institution =
    (pick(inner, "institution", "institution_name") as string) ??
    (pick(team, "institution", "institution_name") as string) ??
    undefined;

  return {
    id: (inner?.id ?? raw?.id ?? "") as string,
    teamId: (inner?.teamId ?? inner?.team_id ?? raw?.teamId ?? (team as { id?: string })?.id ?? "") as string,
    teamName,
    institution,
    competition,
    amount: (inner?.amount ?? raw?.amount ?? "") as string,
    paymentType: (inner?.paymentType ?? inner?.payment_type ?? raw?.paymentType ?? "") as string,
    paymentProofUrl: (pick(inner, "paymentProofUrl", "payment_proof_url", "file_url", "proof_url", "proofUrl") ?? pick(raw, "paymentProofUrl", "payment_proof_url", "file_url") ?? null) as string | null,
    proofSignedUrl: (pick(inner, "paymentProofUrl", "proofSignedUrl", "proof_signed_url", "signedUrl", "signed_url") ?? pick(raw, "paymentProofUrl", "proofSignedUrl")) as string | null | undefined,
    verificationStatus: ((inner?.verificationStatus ?? inner?.verification_status ?? raw?.verificationStatus ?? "Pending") as string) as "Pending" | "Verified" | "Rejected",
    rejectionNotes: (inner?.rejectionNotes ?? inner?.rejection_notes ?? raw?.rejectionNotes ?? null) as string | null,
    createdAt: (inner?.createdAt ?? inner?.created_at ?? raw?.createdAt ?? "") as string,
  };
}

/**
 * Hook to fetch manual payment transactions for committee verification.
 * Uses GET /api/admin/transactions.
 */
export function useAdminTransactions() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/transactions", { credentials: "include" });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Failed to load transactions");
        setTransactions([]);
      } else {
        const raw = json?.data ?? json;
        let list: unknown[] = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw === "object") {
          const r = raw as Record<string, unknown>;
          const arr =
            r.transactions ??
            r.pendingTransactions ??
            r.items ??
            r.payments ??
            r.data;
          if (Array.isArray(arr)) {
            list = arr;
          } else {
            list = [raw];
          }
        } else {
          const arr =
            (json.transactions ?? json.pendingTransactions ?? json.items ?? json.payments ?? json.data ?? json) as unknown[];
          list = Array.isArray(arr) ? arr : [];
        }
        if (list.length === 0 && json && typeof json === "object") {
          const j = json as Record<string, unknown>;
          const pending = j.pendingTransactions as unknown[] | undefined;
          const verified = j.verifiedTransactions as unknown[] | undefined;
          const rejected = j.rejectedTransactions as unknown[] | undefined;
          if (Array.isArray(pending) || Array.isArray(verified) || Array.isArray(rejected)) {
            list = [...(pending ?? []), ...(verified ?? []), ...(rejected ?? [])];
          }
        }
        const items = Array.isArray(list)
          ? list.map((x) => normalizeTransaction(x as Record<string, unknown>))
          : [];
        if (typeof window !== "undefined" && res.ok) {
          if (items.length === 0) {
            console.log("[useAdminTransactions] parsed 0 items — response keys:", Object.keys(json ?? {}), "raw:", raw);
          } else if (items.some((i) => !i.teamName || !i.competition)) {
            console.log("[useAdminTransactions] items have empty fields — first raw:", list[0], "first normalized:", items[0]);
          }
        }
        setTransactions(items);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const verifyTransaction = useCallback(
    async (
      transactionId: string,
      teamId: string,
      action: "Verified" | "Rejected",
      rejectionNotes?: string
    ): Promise<{ error: string } | { actualAction: "Verified" | "Rejected" }> => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId
            ? { ...t, verificationStatus: action, rejectionNotes: rejectionNotes ?? t.rejectionNotes }
            : t
        )
      );
      try {
        const res = await fetch(`/api/admin/transactions/${encodeURIComponent(transactionId)}/verify`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            status: action,
            rejection_reason: rejectionNotes,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & { error?: string };
        if (!res.ok) {
          await refetch();
          return { error: data.error ?? `Failed: ${res.status}` };
        }
        const rawStatus =
          data.verificationStatus ??
          data.verification_status ??
          (typeof data.data === "object" && data.data && "verificationStatus" in data.data
            ? (data.data as { verificationStatus?: string }).verificationStatus
            : null);
        const actualAction =
          String(rawStatus ?? action).toLowerCase() === "rejected" ? "Rejected" : "Verified";
        if (actualAction !== action) await refetch();
        else {
          setTransactions((prev) =>
            prev.map((t) =>
              t.id === transactionId
                ? { ...t, verificationStatus: actualAction, rejectionNotes: rejectionNotes ?? t.rejectionNotes }
                : t
            )
          );
        }
        return { actualAction };
      } catch (e) {
        await refetch();
        return { error: e instanceof Error ? e.message : "Failed to reach server" };
      }
    },
    [refetch]
  );

  return { transactions, loading, error, refetch, verifyTransaction };
}
