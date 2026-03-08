"use client";

import { createClient } from "@/lib/supabase";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * Ambil access token dari session Supabase (untuk request ke backend Hono).
 */
export async function getAuthToken(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Fetch ke Next.js API (same-origin) dengan Authorization Bearer token.
 * Token dikirim ke route Next.js yang mem-proxy ke backend.
 */
export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const base = getBackendUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}
