import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  console.log("--- CALLBACK PROCESS START ---");

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
      // 2. Lakukan API Call ke Backend Hono
      // Pastikan NEXT_PUBLIC_BACKEND_URL ada di file .env kamu (misal: http://localhost:8787)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3030'; 
      const checkStatusUrl = `${backendUrl}/api/landing/check-registration`;

      console.log("Fetching status dari Backend:", checkStatusUrl);
      console.log("Mengirim access token:", accessToken);

      const statusResponse = await fetch(checkStatusUrl, {
        method: 'GET',
        headers: {
          // WAJIB: Kirim token agar Hono bisa memproses `c.get('user')`
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!statusResponse.ok) {
        const errText = await statusResponse.text();
        throw new Error(`Backend merespons dengan status ${statusResponse.status}: ${errText}`);
      }

      // Sesuai dengan response dari API Hono kamu
      // { registered: boolean, teamId?, competitionId?, isCompleted? }
      const statusData = await statusResponse.json();
      console.log("Status Registrasi dari Hono:", statusData);

      const isRegistered = statusData.registered;
      const isCompleted = statusData.isCompleted;

      // 3. Logika Pengalihan (Redirect)
      if (isRegistered && isCompleted) {
        // Sudah melengkapi Step 1 dan Step 2
        return NextResponse.redirect(`${origin}/home`); // atau ke /dashboard
      } else if (isRegistered && !isCompleted) {
        // Baru melengkapi Step 1, lanjut ke Step 2
        return NextResponse.redirect(`${origin}/register?step=2`);
      } else {
        // Belum daftar sama sekali, mulai dari Step 1
        return NextResponse.redirect(`${origin}/register?step=2`);
      }

    } catch (err) {
      console.error("Kesalahan saat mengecek status via API:", err);
      // Jika Backend mati atau error, arahkan ke register saja atau tampilkan pesan error
      return NextResponse.redirect(`${origin}/register?error=backend_failed`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}