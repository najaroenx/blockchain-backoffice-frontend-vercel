"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";

// ==================== INTERFACES ====================

export interface DLTUser {
  id: string;
  email: string;
  accessToken?: string;
}

export interface UseDLTAuthResult {
  // Session state
  user: DLTUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Action
  login: (
    email: string,
    password: string,
    callbackUrl?: string
  ) => Promise<void>;
  logout: (callbackUrl?: string) => Promise<void>;

  // Session data
  session: ReturnType<typeof useSession>["data"];
  status: ReturnType<typeof useSession>["status"];
}

// ==================== HOOK ====================

/**
 * Hook for DLT authentication (shared between merchant and seller)
 * Uses NextAuth for session management
 */
export function useDLTAuth(): UseDLTAuthResult {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Transform session user to DLTUser
  const user: DLTUser | null = session?.user
    ? {
        id: session.user.id || "",
        email: session.user.email || "",
        accessToken: session.user.accessToken as string | undefined,
      }
    : null;

  // Login function using NextAuth
  const login = useCallback(
    async (
      email: string,
      password: string,
      callbackUrl: string = "/dlt/merchant"
    ) => {
      await signIn("credentials", {
        redirect: true,
        callbackUrl,
        email,
        password,
      });
    },
    []
  );

  // Logout function
  const logout = useCallback(async (callbackUrl: string = "/dlt/sign-in") => {
    await signOut({
      redirect: true,
      callbackUrl,
    });
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    session,
    status,
  };
}
