"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChange, logout as doLogout, type User } from "@/lib/auth";

// =============================================================================
// useAuth Hook — Supabase version
// =============================================================================

interface UseAuthOptions {
  required?: boolean;
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((u) => {
      setUser(u);
      setLoading(false);

      if (options.required && !u) {
        router.push("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [options.required, router]);

  const logout = useCallback(async () => {
    await doLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    logout,
  };
}
