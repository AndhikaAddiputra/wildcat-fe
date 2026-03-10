import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_PATHS, isCommitteePath, isAdminPath, isParticipantPath } from "@/lib/constants/roles";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 1. Lewati pengecekan untuk rute publik (landing, login, dsb)
  const isPublic = PUBLIC_PATHS.some((p) => p === pathname || pathname.startsWith(p + "/"));
  if (isPublic) return response;

  // Lewati role-check untuk Next.js API routes (/api/*).
  // API route handlers bertanggung jawab atas autorisasi masing-masing.
  if (pathname.startsWith("/api/")) return response;

  // 2. Inisialisasi Supabase client untuk Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Ambil Sesi / Token dari Supabase
  const { data: { session } } = await supabase.auth.getSession();

  // Jika tidak ada sesi dan bukan public path, lempar ke login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session) {
    let role = "participant"; // Default / Fallback jika 403

    // 4. Hit endpoint Backend untuk mendapatkan informasi Role
    try {
      // Ambil URL Backend dari environment (seperti di src/lib/api/backend.ts)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "http://localhost:3030";
      
      const res = await fetch(`${backendUrl}/api/admin/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`, // Kirim token Supabase
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.committee) {
          // Backend mengembalikan "Admin" atau "Committee". Ubah ke lowercase agar sesuai dengan konstanta kita.
          role = data.committee.role.toLowerCase(); 
        }
      } else if (res.status === 403) {
        // Jika 403 Forbidden, biarkan role tetap "participant" (User biasa)
        role = "participant";
      }
    } catch (error) {
      console.error("Gagal mengambil info role dari backend:", error);
      // Jika terjadi error koneksi ke backend, amankan sebagai participant
      role = "participant";
    }

    // 5. Logika Pengeblokan dan Redirect Halaman berdasarkan Role
    // Mencegah Participant masuk ke area Committee / Admin
    if (isCommitteePath(pathname) && role !== "committee" && role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url)); 
    }
    
    // Mencegah Participant & Committee masuk ke area Admin
    if (isAdminPath(pathname) && role !== "admin") {
      // Jika dia setidaknya committee, lempar ke dashboard committee, selain itu ke participant home
      console.log("Blocked access to Admin path for role:", role);
      return NextResponse.redirect(new URL(role === "committee" ? "/committee/home" : "/home", request.url));
      
    }
    
    // Mencegah Admin/Committee nyasar ke dashboard Participant (/home, /teams, dll)
    if (isParticipantPath(pathname) && role !== "participant") {
      if (role === "admin") return NextResponse.redirect(new URL("/admin/home", request.url));
      if (role === "committee") return NextResponse.redirect(new URL("/committee/home", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};