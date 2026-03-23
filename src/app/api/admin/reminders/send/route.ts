import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getBackendUrl } from "@/lib/api/backend";

type SendReminderBody = {
  teamId?: string;
  teamName?: string; // fallback: lookup auth user id via team_accounts.team_name
  email?: string; // optional: jika backend mengembalikan email, gunakan langsung
  paymentStatus?: string;
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function safeLower(s: unknown): string {
  return typeof s === "string" ? s.toLowerCase() : "";
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as SendReminderBody | null;
    const teamId = body?.teamId?.trim();
    const teamName = body?.teamName?.trim();
    const rawEmail = body?.email?.trim();
    const paymentStatus = safeLower(body?.paymentStatus);

    console.log("[reminders/send] Request:", { teamId, teamName, hasEmail: !!rawEmail, paymentStatus });

    if (!teamId && !teamName && !rawEmail) {
      return NextResponse.json({ error: "Missing teamId, teamName, or email" }, { status: 400 });
    }

    // Per requirements: do not send reminder to already verified participants.
    if (paymentStatus === "verified") {
      return NextResponse.json(
        { error: "Cannot send reminder to participants with paymentStatus=Verified" },
        { status: 400 }
      );
    }

    // Authorization: confirm caller is admin/committee using backend /api/admin/me.
    const backendUrl = getBackendUrl();
    const meRes = await fetch(`${backendUrl}/api/admin/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const me = (await meRes.json().catch(() => ({}))) as Record<string, unknown>;

    const roleRaw = (me as any)?.committee?.role ?? (me as any)?.role;
    const role = safeLower(roleRaw);
    if (role !== "admin" && role !== "committee") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing Supabase env vars" },
        { status: 500 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const fromName = process.env.RESEND_FROM_NAME;
    if (!resendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing Resend env vars" },
        { status: 500 }
      );
    }

    // Admin client to fetch email from Supabase Auth (auth.users).
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    let authUserId = teamId ?? null;
    let toEmail: string | null = rawEmail && isValidEmail(rawEmail) ? rawEmail : null;
    let lastError: string | null = null;

    if (toEmail) {
      console.log("[reminders/send] Using email from request");
    }

    const tryGetUser = async (uid: string) => {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(uid);
      console.log("[reminders/send] getUserById:", { uid, found: !!data?.user?.email, error: error?.message });
      if (!error && data?.user?.email) {
        toEmail = data.user.email.trim();
        return true;
      }
      lastError = error?.message ?? null;
      return false;
    };

    if (!toEmail && authUserId && (await tryGetUser(authUserId))) {
      // got email
    } else if (!toEmail && teamName) {
      // Fallback: cari auth user id dari tabel team_accounts via team_name.
      const { data: teamRow, error: teamErr } = await supabaseAdmin
        .from("team_accounts")
        .select("id")
        .eq("team_name", teamName)
        .limit(1)
        .maybeSingle();
      console.log("[reminders/send] team_accounts by team_name:", {
        teamName,
        foundId: teamRow?.id ?? null,
        error: teamErr?.message ?? null,
      });
      if (teamErr?.message?.includes("permission denied")) {
        console.warn(
          "[reminders/send] Supabase permission denied. Run in SQL Editor: GRANT USAGE ON SCHEMA public TO service_role; GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;"
        );
      }
      if (teamRow?.id) {
        await tryGetUser(String(teamRow.id));
      }
    }

    if (!toEmail) {
      console.log("[reminders/send] Failed:", { lastError, teamId, teamName });
      let errMsg = lastError ?? "Could not resolve recipient email for teamId/teamName";
      if (String(lastError ?? "").includes("permission denied")) {
        errMsg += ". Fix: Supabase SQL Editor → GRANT USAGE ON SCHEMA public TO service_role; GRANT SELECT ON ALL TABLES IN SCHEMA public TO service_role;";
      }
      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    // Build absolute links.
    // Untuk logo pakai NEXT_PUBLIC_APP_URL (domain publik) agar bisa diakses email client.
    // Untuk link navigasi bisa ikut NEXT_PUBLIC_APP_URL juga.
    const reqUrl = new URL(request.url);
    const appBase = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "")
      || `${reqUrl.protocol}//${reqUrl.host}`;
    const teamsLink = `${appBase}/teams`;
    const administrationLink = `${appBase}/administration`;

    const subject = "Wildcat 2026: Complete Your Registration Reminder";
    const text = [
      `Hi!`,
      ``,
      `This is a reminder to complete your Wildcat 2026 registration.`,
      ``,
      `1) Complete your team details: ${teamsLink}`,
      `2) Verify your administrative documents: ${administrationLink}`,
      `3) Pay the registration fee on the Administration page`,
      ``,
      `If you have already completed the process, you can ignore this email.`,
    ].join("\n");

    const linkedInUrl = "https://www.linkedin.com/company/wildcat-aapg-itb/";
    const instagramUrl = "https://www.instagram.com/wildcataapgitb/";
    const emailUrl = "mailto:wildcataapg2026@gmail.com";

    // ─── Step row: numbered badge + teks ───
    const stepRow = (num: string, text: string, link?: string) => `
      <tr>
        <td width="36" style="width:36px;vertical-align:top;padding-bottom:16px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td width="28" height="28" style="width:28px;height:28px;background-color:#F6911E;border-radius:50%;text-align:center;vertical-align:middle;font-size:13px;font-weight:700;color:#0A2D6E;font-family:Arial,sans-serif;line-height:28px;">${num}</td>
            </tr>
          </table>
        </td>
        <td style="padding-bottom:16px;vertical-align:top;padding-left:12px;">
          ${link
            ? `<a href="${link}" style="color:#F6911E !important;text-decoration:none;font-size:15px;font-weight:600;line-height:28px;font-family:Arial,sans-serif;">${text}</a>`
            : `<span style="color:#c8d4f0 !important;font-size:15px;line-height:28px;font-family:Arial,sans-serif;">${text}</span>`}
        </td>
      </tr>`;

    const html = `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--
      color-scheme: mencegah Gmail dark mode mengubah warna teks/background.
      "light only" = selalu render dalam mode terang.
    -->
    <meta name="color-scheme" content="light only">
    <meta name="supported-color-schemes" content="light only">
    <title>Wildcat 2026 Reminder</title>
    <style>
      :root { color-scheme: light only; }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:#eef0f6;font-family:Arial,'Helvetica Neue',sans-serif;color-scheme:light only;">

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#eef0f6">
      <tr><td align="center" style="padding:32px 16px;">

        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;">

          <!-- ══ BODY ══ -->
          <tr>
            <td bgcolor="#192d6e" style="background-color:#192d6e;padding:40px 36px;">

              <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff !important;font-family:Georgia,serif;">Hi there! &#128075;</p>
              <p style="margin:0 0 28px;font-size:15px;color:#c8d4f0 !important;line-height:1.7;">This is a friendly reminder to complete your <strong style="color:#ffffff !important;">Wildcat 2026</strong> registration. Please make sure all three steps below are done.</p>

              <!-- Steps card -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#2a3d7a" style="background-color:#2a3d7a;border-radius:12px;border:1px solid #F6911E;">
                <tr>
                  <td style="padding:28px 28px 12px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      ${stepRow("1", "Complete your team details", teamsLink)}
                      ${stepRow("2", "Verify your administrative documents", administrationLink)}
                      ${stepRow("3", "Pay the registration fee on the Administration page")}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td bgcolor="#F6911E" style="background-color:#F6911E;border-radius:8px;text-align:center;">
                    <a href="${administrationLink}" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0B1F5B !important;text-decoration:none;font-family:Arial,sans-serif;letter-spacing:0.5px;">Go to Administration &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:13px;color:#a8b8e8 !important;line-height:1.6;font-style:italic;">If you have already completed all steps, please disregard this email.</p>
              ${fromName ? `<p style="margin:16px 0 0;font-size:12px;color:#a8b8e8 !important;">&#8212; ${fromName}</p>` : ""}

            </td>
          </tr>

        </table>
      </td></tr>
    </table>

  </body>
</html>`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
        to: [toEmail],
        subject,
        text,
        html,
      }),
    });

    const resendJson = await resendRes.json().catch(() => ({}));
    if (resendRes.ok) {
      console.log("[reminders/send] Success:", { toEmail, messageId: resendJson?.id });
    }
    if (!resendRes.ok) {
      console.error("[reminders/send] Resend failed:", {
        status: resendRes.status,
        statusText: resendRes.statusText,
        body: resendJson,
        toEmail,
        fromEmail,
      });
      return NextResponse.json(
        {
          error:
            resendJson?.message ??
            resendJson?.error?.message ??
            resendJson?.error ??
            resendJson?.name ??
            "Failed to send email via Resend",
          details: resendJson,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, email: toEmail, messageId: resendJson?.id ?? null },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Reminder send failed" },
      { status: 500 }
    );
  }
}

