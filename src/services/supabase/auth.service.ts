/**
 * Supabase auth service.
 * Centralize sign-in, sign-out, session, and role resolution here.
 */
// import { supabase } from "@/lib/supabase/client";
// import type { Role } from "@/lib/constants/roles";

// export async function signInWithGoogle() {
//   const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" });
//   return { data, error };
// }

// export async function signOut() {
//   return supabase.auth.signOut();
// }

// export async function getSession() {
//   const { data: { session } } = await supabase.auth.getSession();
//   return session;
// }

// export function getRoleFromUser(user: User): Role { ... }

export const authService = {
  signInWithGoogle: async () => ({ data: null, error: null }),
  signOut: async () => {},
  getSession: async () => null,
};
