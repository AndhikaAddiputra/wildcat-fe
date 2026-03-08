"use client";

import { useState, useEffect } from "react";
import type { Role } from "@/lib/constants/roles";

/**
 * Auth state for RBAC. Replace with Supabase auth when integrated.
 */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  teamId?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: get session from Supabase (services/supabase/auth.service)
    // const { data: { session } } = await supabase.auth.getSession();
    // setUser(session?.user ? mapToAuthUser(session.user) : null);
    setUser(null);
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
