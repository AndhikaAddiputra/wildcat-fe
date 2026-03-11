import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * POST /api/payment/callback
 * Webhook handler for Mayar payment notifications.
 * Configure this URL in Mayar dashboard: Integration → Webhook → URL Webhook
 * Example: https://your-domain.com/api/payment/callback
 *
 * Mayar sends event: "payment.received"
 * Payload: { event, data: { id, status, amount, customerName, customerEmail, transactionStatus, ... } }
 *
 * Forwards to backend (MAYAR_CALLBACK_BACKEND_PATH, default /api/payment/callback).
 * Backend must find transaction by Mayar transactionId (id) and update status to Verified.
 * Ensure backend stores Mayar transactionId when payment link is created.
 */
const PAYMENT_RECEIVED = "payment.received";

interface MayarCallbackPayload {
  event?: string;
  "event.received"?: string;
  data?: {
    id?: string;
    transactionId?: string;
    status?: string | boolean;
    transactionStatus?: string;
    amount?: number;
    customerName?: string;
    customerEmail?: string;
    paymentMethod?: string;
    merchantId?: string;
    [key: string]: unknown;
  };
}

function getEvent(payload: MayarCallbackPayload): string | undefined {
  return payload["event.received"] ?? payload.event ?? (payload as { event?: string }).event;
}

export async function POST(request: Request) {
  console.log("[api/payment/callback] POST — webhook received");
  try {
    const payload = (await request.json().catch(() => null)) as MayarCallbackPayload | null;
    if (!payload || typeof payload !== "object") {
      console.log("[api/payment/callback] POST — 400 invalid body");
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const event = getEvent(payload);
    console.log("[api/payment/callback] POST — event", { event, dataKeys: payload.data ? Object.keys(payload.data) : [] });

    if (event !== PAYMENT_RECEIVED) {
      console.log("[api/payment/callback] POST — event ignored (not payment.received)");
      return NextResponse.json({ received: true, message: "Event ignored" }, { status: 200 });
    }

    const data = payload.data;
    const success = data?.status === true || data?.status === "success" || data?.transactionStatus === "paid";
    if (!success) {
      console.log("[api/payment/callback] POST — status not success", {
        status: data?.status,
        transactionStatus: data?.transactionStatus,
      });
      return NextResponse.json({ received: true, message: "Status not success" }, { status: 200 });
    }

    const transactionId = data?.id ?? data?.transactionId;
    if (!transactionId) {
      console.warn("[api/payment/callback] POST — no transactionId in payload:", JSON.stringify(payload).slice(0, 500));
      return NextResponse.json({ received: true, message: "No transactionId" }, { status: 200 });
    }

    const base = getBackendUrl();
    const callbackPath = process.env.MAYAR_CALLBACK_BACKEND_PATH ?? "/api/payment/callback";
    const url = `${base}${callbackPath.startsWith("/") ? "" : "/"}${callbackPath}`;
    const authHeader = process.env.MAYAR_WEBHOOK_BACKEND_AUTH_HEADER;

    console.log("[api/payment/callback] POST — forwarding to backend", {
      url,
      transactionId,
      amount: data.amount,
      customerEmail: data.customerEmail?.slice(0, 20),
    });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        event: PAYMENT_RECEIVED,
        transactionId,
        amount: data.amount,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        paymentMethod: data.paymentMethod,
        source: "mayar",
        ...payload,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[api/payment/callback] POST — backend failed:", res.status, errText);
      return NextResponse.json({ received: true, message: "Backend update failed" }, { status: 200 });
    }

    console.log("[api/payment/callback] POST — success", { transactionId });
    return NextResponse.json({ received: true, success: true }, { status: 200 });
  } catch (e) {
    console.error("[api/payment/callback] POST — error:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
