import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_PATHS } from "@/lib/constants/roles";

/**
 * RBAC middleware: protect dashboard routes by role when auth is enabled.
 * For now, allows all routes; add session check and redirect when Supabase is integrated.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => p === pathname || pathname.startsWith(p + "/"));
  if (isPublic) return NextResponse.next();

  // TODO: when Supabase auth is ready:
  // const session = await getSession(request);
  // if (!session && !isPublic) return NextResponse.redirect(new URL("/login", request.url));
  // if (session) {
  //   const role = getRoleFromUser(session.user);
  //   if (isCommitteePath(pathname) && role !== "committee") return redirect to /home or /landing;
  //   if (isAdminPath(pathname) && role !== "admin") return redirect;
  //   if (isParticipantPath(pathname) && role !== "participant") return redirect;
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
