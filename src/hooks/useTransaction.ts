"use client";

import { useState, useEffect, useCallback } from "react";

export interface TransactionData {
  id: string;
  teamId: string;
  amount: string;
  paymentType: string;
  paymentProofUrl: string | null;
  /** Signed URL for preview (if backend provides) */
  proofSignedUrl?: string | null;
  verificationStatus: "Pending" | "Verified" | "Rejected";
  rejectionNotes: string | null;
  createdAt: string;
}

function normalizeTransaction(raw: Record<string, unknown>): TransactionData {
  const d = raw?.data ?? raw;
  const inner = (typeof d === "object" && d !== null ? d : raw) as Record<string, unknown>;
  return {
    id: (inner?.id ?? raw?.id ?? "") as string,
    teamId: (inner?.teamId ?? inner?.team_id ?? raw?.teamId ?? "") as string,
    amount: (inner?.amount ?? raw?.amount ?? "") as string,
    paymentType: (inner?.paymentType ?? inner?.payment_type ?? inner?.paymentMethod ?? raw?.paymentType ?? "") as string,
    paymentProofUrl: (inner?.paymentProofUrl ?? inner?.payment_proof_url ?? inner?.file_url ?? raw?.paymentProofUrl ?? null) as string | null,
    proofSignedUrl: (inner?.proofSignedUrl ?? inner?.proof_signed_url ?? inner?.signedUrl ?? inner?.signed_url ?? inner?.downloadUrl ?? inner?.download_url ?? inner?.previewUrl ?? inner?.url ?? raw?.proofSignedUrl ?? null) as string | null | undefined,
    verificationStatus: ((inner?.verificationStatus ?? inner?.verification_status ?? raw?.verificationStatus ?? "Pending") as string) as "Pending" | "Verified" | "Rejected",
    rejectionNotes: (inner?.rejectionNotes ?? inner?.rejection_notes ?? raw?.rejectionNotes ?? null) as string | null,
    createdAt: (inner?.createdAt ?? inner?.created_at ?? raw?.createdAt ?? "") as string,
  };
}

/**
 * Hook to fetch participant's latest payment transaction.
 * Uses GET /api/transactions.
 */
export function useTransaction() {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        console.log("[payment-proof] GET /api/transactions — fetching latest payment submission");
      }
      const res = await fetch("/api/transactions", { credentials: "include" });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.status === 404) {
        setData(null);
        if (typeof window !== "undefined") {
          console.log("[payment-proof] GET /api/transactions — no transaction found (404)");
        }
      } else if (!res.ok) {
        setError((json?.error as string) ?? "Failed to load transaction");
        setData(null);
      } else if (json?.success === true && json?.data) {
        const tx = normalizeTransaction(json as Record<string, unknown>);
        setData(tx);
        if (typeof window !== "undefined") {
          console.log("[payment-proof] GET /api/transactions — success", {
            status: tx.verificationStatus,
            hasPaymentProofUrl: !!tx.paymentProofUrl,
            hasProofSignedUrl: !!tx.proofSignedUrl,
            paymentProofUrlPreview: tx.paymentProofUrl ? String(tx.paymentProofUrl).slice(0, 80) : null,
          });
        }
      } else if (json?.data) {
        const tx = normalizeTransaction(json as Record<string, unknown>);
        setData(tx);
        if (typeof window !== "undefined") {
          console.log("[payment-proof] GET /api/transactions — success", {
            status: tx.verificationStatus,
            hasPaymentProofUrl: !!tx.paymentProofUrl,
            hasProofSignedUrl: !!tx.proofSignedUrl,
            paymentProofUrlPreview: tx.paymentProofUrl ? String(tx.paymentProofUrl).slice(0, 80) : null,
          });
        }
      } else {
        setData(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load transaction");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
