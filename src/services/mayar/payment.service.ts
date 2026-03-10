/**
 * Mayar.id payment service (client).
 * Memanggil API kita /api/mayar/create-invoice lalu redirect ke link Mayar.
 */

export interface CreatePaymentLinkParams {
  teamId: string;
  name: string;
  email: string;
  mobile?: string;
  redirectUrl?: string;
}

export interface CreatePaymentLinkResult {
  link: string;
  invoiceId: string;
  transactionId?: string;
  expiredAt?: number;
}

export async function createPaymentLink(params: CreatePaymentLinkParams): Promise<CreatePaymentLinkResult> {
  const res = await fetch("/api/mayar/create-invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teamId: params.teamId,
      name: params.name,
      email: params.email,
      mobile: params.mobile ?? undefined,
      redirectUrl: params.redirectUrl ?? (typeof window !== "undefined" ? `${window.location.origin}/administration?paid=1` : undefined),
    }),
  });
  const data = await res.json().catch(() => ({})) as { link?: string; invoiceId?: string; transactionId?: string; expiredAt?: number; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to create payment link");
  }
  if (!data.link) {
    throw new Error("Response does not contain payment link");
  }
  return {
    link: data.link,
    invoiceId: data.invoiceId ?? "",
    transactionId: data.transactionId,
    expiredAt: data.expiredAt,
  };
}

export async function getPaymentStatus(_invoiceId: string): Promise<{ status: string }> {
  // TODO: jika Mayar punya endpoint cek status, panggil dari server dan expose di /api/mayar/status
  return { status: "pending" };
}

export const paymentService = {
  createPaymentLink,
  getPaymentStatus,
};
