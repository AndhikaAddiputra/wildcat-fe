import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // 1. Tukar Code dengan Session Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authError) {
      console.error("Auth Error:", authError.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Ambil access_token dari session untuk dikirim ke Backend Hono
    const accessToken = authData.session?.access_token;

    if (!accessToken) {
      console.error("No access token found");
      return NextResponse.redirect(`${origin}/login?error=no_token`);
    }

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3030';
      const checkStatusUrl = `${backendUrl}/api/landing/check-registration`;

      const fetchWithTimeout = (url: string, options: RequestInit, timeoutMs = 20_000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
      };

      const doCheck = () =>
        fetchWithTimeout(checkStatusUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }, 20_000);

      let statusResponse: Response | undefined;
      try {
        statusResponse = await doCheck();
      } catch (firstErr) {
        await new Promise((r) => setTimeout(r, 800));
        try {
          statusResponse = await doCheck();
        } catch {
          throw firstErr;
        }
      }

      if (!statusResponse?.ok) {
        const errText = statusResponse ? await statusResponse.text() : "";
        throw new Error(`Backend merespons dengan status ${statusResponse?.status ?? 0}: ${errText}`);
      }

      if (!statusResponse) throw new Error("Backend unreachable");
      const statusData = await statusResponse.json().catch(() => ({}));
      const isRegistered = statusData?.registered === true;
      const isCompleted = statusData?.isCompleted === true;

      // 3. Logika Pengalihan (Redirect)
      if (isRegistered && isCompleted) {
        // Sudah melengkapi Step 1 dan Step 2
        return NextResponse.redirect(`${origin}/home`); // atau ke /dashboard
      } else if (isRegistered && !isCompleted) {
        // Baru melengkapi Step 1, lanjut ke Step 2
        return NextResponse.redirect(`${origin}/home`);
      } else {
        // Belum daftar sama sekali, mulai dari Step 1
        return NextResponse.redirect(`${origin}/register?step=2`);
      }

    } catch (err) {
      console.error("Kesalahan saat mengecek status via API:", err);
      // Backend tidak bisa diakses: tetap redirect ke dashboard home participant.
      // Middleware bisa redirect ke /register jika user belum punya tim.
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}