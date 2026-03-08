import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend";

/**
 * POST /api/mayar/webhook
 *
 * Menerima webhook dari Mayar.id (event: payment.received).
 * Set URL ini di dashboard Mayar: Integration → Webhook → URL Webhook
 * Contoh: https://your-domain.com/api/mayar/webhook
 *
 * Payload Mayar (contoh):
 * - event.received / event: "payment.received"
 * - data.status, data.amount, data.id (transaction)
 * - data.extraData.teamId (dari extraData saat create invoice)
 *
 * Setelah validasi: panggil backend untuk update status tim jadi Paid.
 * Backend endpoint: POST {BACKEND}/api/landing/payment/confirm (atau MAYAR_WEBHOOK_CONFIRM_PATH)
 * Body: { teamId, transactionId, amount, source: "mayar" }
 * Jika backend butuh auth server-to-server, set env MAYAR_WEBHOOK_BACKEND_AUTH_HEADER (value penuh, mis. "Bearer secret").
 */

const PAYMENT_RECEIVED = "payment.received";

interface MayarWebhookPayload {
  event?: { received?: string };
  "event.received"?: string;
  data?: {
    id?: string;
    status?: boolean;
    amount?: number;
    extraData?: { teamId?: string };
    teamId?: string;
    customerName?: string;
    customerEmail?: string;
    transactionId?: string;
  };
}

function getEventReceived(payload: MayarWebhookPayload): string | undefined {
  return payload["event.received"] ?? payload.event?.received ?? (payload as { event?: string }).event;
}

function getTeamId(payload: MayarWebhookPayload): string | undefined {
  const d = payload.data;
  if (!d) return undefined;
  return d.extraData?.teamId ?? d.teamId;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => null)) as MayarWebhookPayload | null;
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const event = getEventReceived(payload);
    if (event !== PAYMENT_RECEIVED) {
      return NextResponse.json({ received: true, message: "Event ignored" }, { status: 200 });
    }

    const data = payload.data;
    const success = data?.status === true || data?.status === "success";
    if (!success) {
      return NextResponse.json({ received: true, message: "Status not success" }, { status: 200 });
    }

    const teamId = getTeamId(payload);
    if (!teamId) {
      console.warn("[mayar/webhook] payment.received but no teamId in payload:", JSON.stringify(payload).slice(0, 500));
      return NextResponse.json({ received: true, message: "No teamId" }, { status: 200 });
    }

    const base = getBackendUrl();
    const confirmPath = process.env.MAYAR_WEBHOOK_CONFIRM_PATH ?? "/api/landing/payment/confirm";
    const url = `${base}${confirmPath.startsWith("/") ? "" : "/"}${confirmPath}`;
    const authHeader = process.env.MAYAR_WEBHOOK_BACKEND_AUTH_HEADER;

    const confirmRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        teamId,
        transactionId: data.id ?? data.transactionId,
        amount: data.amount,
        source: "mayar",
      }),
    });

    if (!confirmRes.ok) {
      console.error("[mayar/webhook] backend confirm failed:", confirmRes.status, await confirmRes.text());
      return NextResponse.json(
        { received: true, message: "Backend confirm failed" },
        { status: 200 }
      );
    }

    return NextResponse.json({ received: true, message: "OK" }, { status: 200 });
  } catch (e) {
    console.error("[mayar/webhook] error:", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
