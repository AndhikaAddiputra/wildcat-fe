const NOT_VERIFIED_MESSAGE =
  "Please complete your administration verification and payment before submitting your competition files.";

/**
 * Parse error dari response submission API.
 * Backend bisa mengembalikan: { success: false, error: { code: "NOT_VERIFIED", message: "..." } }
 */
export function normalizeSubmissionErrorMessage(raw: string | Record<string, unknown>): string {
  if (typeof raw === "string") {
    try {
      return normalizeSubmissionErrorMessage(JSON.parse(raw) as Record<string, unknown>);
    } catch {
      return raw || "Failed to submit. Please try again.";
    }
  }
  const err = raw?.error;
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (obj?.code === "NOT_VERIFIED") {
      return NOT_VERIFIED_MESSAGE;
    }
    const innerMsg = obj?.message;
    if (typeof innerMsg === "string") return innerMsg;
  }
  const msg = (raw?.error ?? raw?.message) as string | undefined;
  if (typeof msg === "string") return msg;
  return "Failed to submit. Please try again.";
}

/**
 * Ambil pesan error yang ramah dari response API.
 * Backend bisa mengembalikan JSON: { success: false, error: "..." } atau { error: "..." }.
 */
export function normalizeApiErrorMessage(
  raw: string | Record<string, unknown>,
  fallback = "An error occurred. Please try again."
): string {
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return normalizeApiErrorMessage(parsed, fallback);
    } catch {
      if (/Internal Server Error|Failed query|ECONNREFUSED|timeout/i.test(raw)) {
        return "Service temporarily unavailable. Please reload or try again.";
      }
      return raw || fallback;
    }
  }
  const err = raw?.error;
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if (obj?.code === "NOT_VERIFIED") {
      return NOT_VERIFIED_MESSAGE;
    }
    const innerMsg = obj?.message;
    if (typeof innerMsg === "string") return innerMsg;
  }
  const msg = (raw?.error ?? raw?.message) as string | undefined;
  if (!msg || typeof msg !== "string") return fallback;
  if (/Internal Server Error|500|Failed query|ECONNREFUSED|connection|timeout/i.test(msg)) {
    return "Service temporarily unavailable. Please reload or try again.";
  }
  return msg;
}
