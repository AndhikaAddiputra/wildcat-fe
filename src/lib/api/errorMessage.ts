/**
 * Ambil pesan error yang ramah dari response API.
 * Backend bisa mengembalikan JSON: { success: false, error: "..." } atau { error: "..." }.
 */
export function normalizeApiErrorMessage(
  raw: string | Record<string, unknown>,
  fallback = "Terjadi kesalahan. Silakan coba lagi."
): string {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return normalizeApiErrorMessage(parsed, fallback);
    } catch {
      if (/Internal Server Error|Failed query|ECONNREFUSED|timeout/i.test(raw)) {
        return "Layanan sementara tidak dapat diakses. Silakan muat ulang atau coba lagi.";
      }
      return raw || fallback;
    }
  }
  const msg = (raw?.error ?? raw?.message) as string | undefined;
  if (!msg || typeof msg !== "string") return fallback;
  if (/Internal Server Error|500|Failed query|ECONNREFUSED|connection|timeout/i.test(msg)) {
    return "Layanan sementara tidak dapat diakses. Silakan muat ulang atau coba lagi.";
  }
  return msg;
}
