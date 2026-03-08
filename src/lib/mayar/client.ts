/**
 * Mayar.id payment gateway — dipakai hanya di server (API route).
 * Env: MAYAR_API_KEY (wajib), MAYAR_BASE_URL (opsional, default https://api.mayar.id; sandbox: https://api.mayar.club).
 */

const DEFAULT_BASE_URL = "https://api.mayar.id";

function getBaseUrl(): string {
  return (process.env.MAYAR_BASE_URL || process.env.NEXT_PUBLIC_MAYAR_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

function getApiKey(): string {
  const key = process.env.MAYAR_API_KEY;
  if (!key) throw new Error("MAYAR_API_KEY is not set. Add it in .env or .env.local.");
  return key;
}

export interface MayarCreateInvoiceParams {
  name: string;
  email: string;
  mobile?: string;
  redirectUrl: string;
  description: string;
  expiredAt: string;
  items: { quantity: number; rate: number; description: string }[];
  extraData?: Record<string, string>;
}

export interface MayarCreateInvoiceResponse {
  statusCode: number;
  messages: string;
  data: {
    id: string;
    transactionId: string;
    link: string;
    expiredAt: number;
    extraData?: Record<string, string>;
  };
}

export async function createInvoice(params: MayarCreateInvoiceParams): Promise<MayarCreateInvoiceResponse["data"]> {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  const res = await fetch(`${baseUrl}/hl/v1/invoice/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  const json = (await res.json()) as MayarCreateInvoiceResponse & { messages?: string; error?: string };
  if (!res.ok) {
    const msg = json.messages ?? json.error ?? `Mayar API error: ${res.status}`;
    throw new Error(msg);
  }
  if (json.statusCode !== 200 || !json.data?.link) {
    throw new Error(json.messages ?? "Invalid response from Mayar");
  }
  return json.data;
}

export const mayarClient = {
  createInvoice,
  getBaseUrl,
};
