"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { normalizeEvent } from "@/lib/api/normalize";
import type { EventItem } from "@/lib/api/types";

/**
 * Fetch daftar events dari backend.
 * GET /api/events — tabel events (hanya is_published = true bila backend filter).
 */
export function useEvents() {
  const [data, setData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/api/events");
      if (res.status === 404) {
        setData([]);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Gagal memuat events");
      }
      const json = await res.json();
      const list = Array.isArray(json) ? json : (json.events ?? json.data ?? []);
      setData(list.map((raw: Record<string, unknown>) => normalizeEvent(raw)));
    } catch {
      setData([]);
      setError("Gagal memuat events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
