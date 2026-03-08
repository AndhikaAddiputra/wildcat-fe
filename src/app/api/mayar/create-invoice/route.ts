import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/mayar/client";

const COMPETITION_FEE_AMOUNT = Number(process.env.COMPETITION_FEE_AMOUNT) || 150_000;
const DEFAULT_EXPIRY_HOURS = 24;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, name, email, mobile, redirectUrl: rawRedirect } = body as {
      teamId?: string;
      name?: string;
      email?: string;
      mobile?: string;
      redirectUrl?: string;
    };

    if (!teamId || !name || !email) {
      return NextResponse.json(
        { error: "teamId, name, dan email wajib diisi." },
        { status: 400 }
      );
    }

    const redirectUrl =
      typeof rawRedirect === "string" && rawRedirect
        ? rawRedirect
        : typeof request.headers.get("origin") === "string"
          ? `${request.headers.get("origin")}/administration?paid=1`
          : process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/administration?paid=1`
            : "";

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "redirectUrl tidak tersedia. Kirim redirectUrl di body atau set NEXT_PUBLIC_APP_URL." },
        { status: 400 }
      );
    }

    const expiredAt = new Date(Date.now() + DEFAULT_EXPIRY_HOURS * 60 * 60 * 1000).toISOString();

    const data = await createInvoice({
      name: String(name).trim(),
      email: String(email).trim(),
      mobile: typeof mobile === "string" && mobile ? mobile.trim() : undefined,
      redirectUrl,
      description: "Biaya lomba Wildcat 2026",
      expiredAt,
      items: [
        {
          quantity: 1,
          rate: COMPETITION_FEE_AMOUNT,
          description: "Competition registration fee",
        },
      ],
      extraData: { teamId: String(teamId) },
    });

    return NextResponse.json({
      link: data.link,
      invoiceId: data.id,
      transactionId: data.transactionId,
      expiredAt: data.expiredAt,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Gagal membuat invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
