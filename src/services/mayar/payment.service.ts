/**
 * Mayar.id payment service.
 * Create payment links and check status; call lib/mayar/client or API directly.
 */
// import { mayarClient } from "@/lib/mayar/client";

// export async function createPaymentLink(params: {
//   amount: number;
//   teamId: string;
//   description: string;
// }) {
//   return mayarClient.createPaymentLink(params);
// }

// export async function getPaymentStatus(invoiceId: string) {
//   return mayarClient.getPaymentStatus(invoiceId);
// }

export const paymentService = {
  createPaymentLink: async (_params: unknown) => ({ url: "", invoiceId: "" }),
  getPaymentStatus: async (_invoiceId: string) => ({ status: "pending" }),
};
