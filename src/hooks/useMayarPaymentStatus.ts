"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMayarPaymentStatus,
  type MayarPaymentStatusResult,
  type MayarPaymentStatus,
} from "@/services/mayar/payment.service";

/**
 * Hook to fetch Mayar payment status for the authenticated team.
 * Uses GET /api/payment/status.
 */
export function useMayarPaymentStatus() {
  const [data, setData] = useState<MayarPaymentStatusResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMayarPaymentStatus();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load payment status");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const hasPayment = data && "hasPayment" in data && data.hasPayment;
  const paymentLink = hasPayment ? (data as MayarPaymentStatus).paymentLink : null;
  const isLinkValid = hasPayment ? (data as MayarPaymentStatus).isLinkValid : false;
  const status = hasPayment ? (data as MayarPaymentStatus).status : null;
  const isPending = hasPayment && status === "pending";

  return {
    data,
    loading,
    error,
    refetch,
    hasPayment: !!hasPayment,
    paymentLink,
    isLinkValid,
    status,
    isPending,
  };
}
