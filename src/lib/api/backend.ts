/**
 * Base URL untuk request API.
 * - Di client (browser): "" agar fetch ke same-origin (Next.js API routes).
 * - Di server (API routes): URL backend Hono untuk proxy.
 */
export function getBackendUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  const url =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3030";
  return url.replace(/\/$/, "");
}
