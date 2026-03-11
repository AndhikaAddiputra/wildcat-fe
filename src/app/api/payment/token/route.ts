import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";
import { createPayment } from "@/lib/mayar/client";

const DEFAULT_EXPIRY_HOURS = 24;

/**
 * POST /api/payment/token
 * 1. Call backend to create transaction (orderId, amount)
 * 2. Call Mayar payment/create to get payment link
 * 3. Return link for FE to redirect
 * Auth: Bearer token required.
 */
export async function POST(request: Request) {
  console.log("[api/payment/token] POST — request received");
  const supabase = await getSupabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    console.log("[api/payment/token] POST — 401 Unauthorized (no session)");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = getBackendUrl();
  const authHeader = `Bearer ${session.access_token}`;
  console.log("[api/payment/token] POST — step 1: backend token", { backendUrl, userId: session.user?.id?.slice(0, 8) });

  try {
    const tokenRes = await fetch(`${backendUrl}/api/payment/token`, {
      method: "POST",
      headers: { Authorization: authHeader, "Content-Type": "application/json" },
    });
    const tokenData = (await tokenRes.json().catch(() => ({}))) as {
      link?: string;
      orderId?: string;
      amount?: number;
      feeType?: string;
      expirationTime?: string;
      error?: string;
      message?: string;
    };

    if (!tokenRes.ok) {
      console.log("[api/payment/token] POST — backend error", { status: tokenRes.status, error: tokenData.error ?? tokenData.message });
      return NextResponse.json(tokenData, { status: tokenRes.status });
    }

    if (tokenData.link) {
      console.log("[api/payment/token] POST — backend returned link, using it");
      return NextResponse.json(tokenData, { status: 200 });
    }

    const orderId = tokenData.orderId;
    const amountRaw = tokenData.amount;
    const amountNum = typeof amountRaw === "number" ? amountRaw : typeof amountRaw === "string" ? parseFloat(String(amountRaw).replace(/[^0-9.-]/g, "")) || 0 : 0;
    const amount = Math.round(amountNum);
    if (!orderId || amount <= 0) {
      console.log("[api/payment/token] POST — backend missing orderId/amount", { orderId: !!orderId, amountRaw, amount });
      return NextResponse.json(
        { error: tokenData.message ?? "Backend did not return orderId or amount" },
        { status: 502 }
      );
    }

    console.log("[api/payment/token] POST — step 2: fetch team for customer info");
    const teamRes = await fetch(`${backendUrl}/api/landing/team`, {
      method: "GET",
      headers: { Authorization: authHeader },
    });
    const teamJson = await teamRes.json().catch(() => ({}));
    const teamData = (teamJson?.data ?? teamJson?.team ?? teamJson) as Record<string, unknown> | undefined ?? {};
    const get = (camel: string, snake: string) =>
      (teamData[camel] as string | undefined) ?? (teamData[snake] as string | undefined) ?? "";
    const name = (get("leadName", "lead_name") || get("leaderName", "leader_name") || (session.user?.user_metadata?.full_name as string) || "Participant").trim() || "Participant";
    const email = (get("email", "email") || (session.user?.email ?? "")).trim();
    const mobile = get("phoneNumber", "phone_number") || get("phone", "phone");
    const rawMobile = typeof mobile === "string" ? mobile.trim() : "";
    const mobileStr = rawMobile.length >= 10 && /^[0-9+]+/.test(rawMobile) ? rawMobile : "081234567890";

    console.log("[api/payment/token] POST — team data extracted", { name: name.slice(0, 15), hasEmail: !!email, mobileLen: mobileStr.length });

    if (!email) {
      console.log("[api/payment/token] POST — 400 no email");
      return NextResponse.json({ error: "Email not found. Please complete team registration." }, { status: 400 });
    }

    const originHeader = request.headers.get("origin");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const origin =
      originHeader ??
      (forwardedHost ? `https://${forwardedHost}` : null) ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://dev.wildcat2026.com";
    const redirectUrl = `${String(origin).replace(/\/$/, "")}/administration?paid=1`;
    const expiredAt = new Date(Date.now() + DEFAULT_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    console.log("[api/payment/token] POST — step 3: Mayar payment/create", { orderId, amount, name: name.slice(0, 15), email: email.slice(0, 20), mobile: mobileStr.slice(0, 15), redirectUrl: redirectUrl.slice(0, 60) });
    const mayarData = await createPayment({
      name,
      email,
      amount,
      mobile: mobileStr,
      redirectUrl,
      description: `Biaya lomba Wildcat 2026 - Order: ${orderId}`,
      expiredAt,
    });

    console.log("[api/payment/token] POST — Mayar success", { hasLink: !!mayarData.link, transactionId: mayarData.transactionId });
    return NextResponse.json({
      link: mayarData.link,
      orderId,
      status: "new_generated",
      message: "New payment link generated",
      amount,
      feeType: tokenData.feeType,
      expirationTime: expiredAt,
      transactionId: mayarData.transactionId,
    });
  } catch (err) {
    console.error("[api/payment/token] POST — error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create payment link" },
      { status: 500 }
    );
  }
}
