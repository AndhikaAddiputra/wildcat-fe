/**
 * Mayar.id payment gateway client.
 * Configure with API key / base URL when integrating.
 */
// const MAYAR_BASE_URL = process.env.NEXT_PUBLIC_MAYAR_BASE_URL ?? "https://api.mayar.id";
// const MAYAR_API_KEY = process.env.MAYAR_API_KEY;

// Placeholder: implement createPaymentLink, getPaymentStatus, etc. when integrating
export const mayarClient = {
  baseUrl: process.env.NEXT_PUBLIC_MAYAR_BASE_URL ?? "",
  // createPaymentLink: async (params: MayarPaymentParams) => { ... },
  // getPaymentStatus: async (invoiceId: string) => { ... },
};
