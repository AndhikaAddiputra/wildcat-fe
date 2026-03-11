/**
 * Mayar.id payment service (client).
 * Integrates with backend POST /api/payment/token and GET /api/payment/status.
 * Auth is via session (credentials: "include").
 */

/** Response from POST /api/payment/token */
export interface RequestPaymentTokenResult {
  link: string;
  orderId: string;
  status: string;
  message?: string;
  amount?: number;
  feeType?: "early_bird" | "normal";
  expirationTime?: string;
  secondsRemaining?: number;
}

/** Response from GET /api/payment/status when hasPayment=true */
export interface MayarPaymentStatus {
  hasPayment: true;
  orderId: string;
  status: string;
  paymentType?: string;
  creationTime?: string;
  expirationTime?: string;
  isLinkValid?: boolean;
  secondsRemaining?: number;
  paymentLink: string;
}

/** Response when no payment */
export interface MayarNoPaymentStatus {
  hasPayment: false;
  message?: string;
}

export type MayarPaymentStatusResult = MayarPaymentStatus | MayarNoPaymentStatus;

/**
 * Request a new payment link from backend.
 * Backend checks team status (Document_Verified), calculates fee, creates Mayar link.
 * Throws on 400 (already paid), 403 (docs not verified), 404, 500.
 */
export async function requestPaymentToken(): Promise<RequestPaymentTokenResult> {
  const res = await fetch("/api/payment/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = (await res.json().catch(() => ({}))) as {
    link?: string;
    orderId?: string;
    status?: string;
    message?: string;
    amount?: number;
    feeType?: string;
    expirationTime?: string;
    secondsRemaining?: number;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.error ?? data.message ?? "Failed to create payment link");
  }
  if (!data.link) {
    throw new Error(data.message ?? "Response does not contain payment link");
  }
  return {
    link: data.link,
    orderId: data.orderId ?? "",
    status: data.status ?? "new_generated",
    message: data.message,
    amount: data.amount,
    feeType: data.feeType as "early_bird" | "normal" | undefined,
    expirationTime: data.expirationTime,
    secondsRemaining: data.secondsRemaining,
  };
}

/**
 * Get current payment status for authenticated team.
 */
export async function getMayarPaymentStatus(): Promise<MayarPaymentStatusResult> {
  const res = await fetch("/api/payment/status", { credentials: "include" });
  const data = (await res.json().catch(() => ({}))) as {
    hasPayment?: boolean;
    orderId?: string;
    status?: string;
    paymentType?: string;
    creationTime?: string;
    expirationTime?: string;
    isLinkValid?: boolean;
    secondsRemaining?: number;
    paymentLink?: string;
    message?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch payment status");
  }
  if (data.hasPayment && data.paymentLink) {
    return {
      hasPayment: true,
      orderId: data.orderId ?? "",
      status: data.status ?? "pending",
      paymentType: data.paymentType,
      creationTime: data.creationTime,
      expirationTime: data.expirationTime,
      isLinkValid: data.isLinkValid,
      secondsRemaining: data.secondsRemaining,
      paymentLink: data.paymentLink,
    };
  }
  return {
    hasPayment: false,
    message: data.message ?? "No payment record found",
  };
}

/** @deprecated Use requestPaymentToken() for backend-integrated flow. Kept for fallback to direct Mayar create-invoice. */
export interface CreatePaymentLinkParams {
  teamId: string;
  name: string;
  email: string;
  mobile?: string;
  redirectUrl?: string;
}

/** @deprecated Use RequestPaymentTokenResult */
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

export const paymentService = {
  requestPaymentToken,
  getMayarPaymentStatus,
  createPaymentLink,
};
