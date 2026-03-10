"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/lib/api/fetchWithAuth";
import { normalizeAnnouncement } from "@/lib/api/normalize";
import { normalizeApiErrorMessage } from "@/lib/api/errorMessage";
import type { AnnouncementItem } from "@/lib/api/types";

const RETRY_DELAY_MS = 500;
const MAX_ATTEMPTS = 3;
const FRIENDLY_ERROR = "Announcements temporarily unavailable. Please try again.";

/**
 * Cek apakah response body adalah error payload (bukan array pengumuman).
 */
function isErrorPayload(json: unknown): json is { success?: boolean; error?: string } {
  if (json === null || typeof json !== "object") return false;
  const o = json as Record<string, unknown>;
  return o.success === false || (typeof o.error === "string" && !Array.isArray(o.announcements));
}

/**
 * Fetch daftar announcement untuk participant home.
 * GET /api/announcements — backend returns array ordered by created_at (newest first).
 * Authenticated: announcements where target_audience = "All" or user's competition.
 * Retry on failure dan handle response { success: false, error: "..." }.
 */
export function useAnnouncements() {
  const [data, setData] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetchWithAuth("/api/announcements");
        const text = await res.text();
        let json: unknown = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          json = text;
        }

        if (!res.ok) {
          const msg = normalizeApiErrorMessage(
            (json ?? text) as string | Record<string, unknown>,
            FRIENDLY_ERROR
          );
          throw new Error(msg);
        }

        if (isErrorPayload(json)) {
          const msg = normalizeApiErrorMessage(json as Record<string, unknown>, FRIENDLY_ERROR);
          throw new Error(msg);
        }

        const list: unknown[] = Array.isArray(json)
          ? json
          : json && typeof json === "object" && !Array.isArray(json)
            ? (Array.isArray((json as Record<string, unknown>).announcements)
                ? (json as Record<string, unknown>).announcements
                : Array.isArray((json as Record<string, unknown>).data)
                  ? (json as Record<string, unknown>).data
                  : []) as unknown[]
            : [];
        setData(list.map((raw) => normalizeAnnouncement(raw as Record<string, unknown>)));
        setLoading(false);
        return;
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(FRIENDLY_ERROR);
        if (attempt < MAX_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          continue;
        }
        setData([]);
        setError(lastError.message);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
