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
  // Extract objek utama (berjaga-jaga jika di-wrap dengan 'data', 'transaction', atau 'payment')
  const d = raw?.data ?? raw;
  const inner = (typeof d === "object" && d !== null ? d : raw) as Record<string, unknown>;
  const tx = (inner?.transaction ?? inner?.payment ?? inner) as Record<string, unknown>;

  // Extract relasi team (mengenali 'team' maupun 'teams')
  const team = (tx?.team ?? tx?.teams ?? tx?.Team ?? inner?.team ?? inner?.teams) as Record<string, unknown> | null | undefined;
  
  // Extract relasi kompetisi (mengenali 'competition' maupun 'competitions')
  const comp = (team?.competition ?? team?.competitions ?? tx?.competition ?? inner?.competition) as Record<string, unknown> | null | undefined;

  const teamName =
    (pick(inner, "teamName", "team_name") as string) ??
    (pick(tx, "teamName", "team_name") as string) ??
    (pick(team, "name", "teamName", "team_name") as string) ??
    "Unknown Team";

  const competition =
    (pick(inner, "competitionName", "competition", "competition_name") as string) ??
    (pick(tx, "competitionName", "competition", "competition_name") as string) ??
    (pick(team, "competitionName", "competition", "competition_name") as string) ??
    (pick(comp, "name", "title") as string) ??
    "-";

  const institution =
    (pick(inner, "institution", "institution_name") as string) ??
    (pick(tx, "institution", "institution_name") as string) ??
    (pick(team, "institution", "institution_name") as string) ??
    undefined;

  const paymentProofUrl = (
    pick(inner, "paymentProofUrl", "payment_proof_url", "file_url", "proof_url", "proofUrl", "url") ?? 
    pick(tx, "paymentProofUrl", "payment_proof_url", "file_url", "proof_url", "proofUrl", "url") ?? null
  ) as string | null;

  const proofSignedUrl = (
    pick(inner, "proofSignedUrl", "proof_signed_url", "signedUrl", "signed_url") ?? 
    pick(tx, "proofSignedUrl", "proof_signed_url", "signedUrl", "signed_url") ?? 
    paymentProofUrl
  ) as string | null;

  const statusRaw = (
    inner?.verificationStatus ?? inner?.verification_status ?? inner?.status ??
    tx?.verificationStatus ?? tx?.verification_status ?? tx?.status ?? "Pending"
  ) as string;

  // Normalisasi status untuk huruf kapital yang konsisten
  const verificationStatus = (
    statusRaw.toLowerCase() === "verified" ? "Verified" :
    statusRaw.toLowerCase() === "rejected" ? "Rejected" : "Pending"
  ) as "Pending" | "Verified" | "Rejected";

  return {
    id: (inner?.id ?? tx?.id ?? "") as string,
    teamId: (inner?.teamId ?? inner?.team_id ?? tx?.teamId ?? tx?.team_id ?? team?.id ?? "") as string,
    teamName,
    institution,
    competition,
    amount: (inner?.amount ?? tx?.amount ?? "") as string,
    paymentType: (inner?.paymentType ?? inner?.payment_type ?? tx?.paymentType ?? tx?.payment_type ?? "Bank Transfer") as string,
    paymentProofUrl,
    proofSignedUrl,
    verificationStatus,
    rejectionNotes: (inner?.rejectionNotes ?? inner?.rejection_notes ?? tx?.rejectionNotes ?? tx?.rejection_notes ?? null) as string | null,
    createdAt: (inner?.createdAt ?? inner?.created_at ?? tx?.createdAt ?? tx?.created_at ?? "") as string,
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
          
          // 👇 LOGIKA BARU UNTUK MEMBACA FORMAT "byStatus" 👇
          if (r.byStatus && typeof r.byStatus === "object") {
            const byStatusObj = r.byStatus as Record<string, unknown>;
            const pending = Array.isArray(byStatusObj.Pending) ? byStatusObj.Pending : [];
            const verified = Array.isArray(byStatusObj.Verified) ? byStatusObj.Verified : [];
            const rejected = Array.isArray(byStatusObj.Rejected) ? byStatusObj.Rejected : [];
            
            // Gabungkan semua array menjadi satu list
            list = [...pending, ...verified, ...rejected];
          } 
          // 👇 FALLBACK JIKA FORMATNYA BERBEDA 👇
          else {
            const pending = r.pendingTransactions as unknown[] | undefined;
            const verified = r.verifiedTransactions as unknown[] | undefined;
            const rejected = r.rejectedTransactions as unknown[] | undefined;
            
            if (Array.isArray(pending) || Array.isArray(verified) || Array.isArray(rejected)) {
              list = [...(pending ?? []), ...(verified ?? []), ...(rejected ?? [])];
            } else {
              const arr = r.transactions ?? r.items ?? r.payments ?? r.data;
              // Cegah memasukkan seluruh object root ke list jika list beneran kosong
              list = Array.isArray(arr) ? arr : [];
            }
          }
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
