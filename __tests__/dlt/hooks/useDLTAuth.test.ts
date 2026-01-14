// __tests__/dlt/hooks/useDLTAuth.test.ts

import { renderHook, act } from "@testing-library/react";
import { useDLTAuth } from "@/app/dlt/hooks/useDLTAuth";
import { useSession, signIn, signOut } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

describe("useDLTAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Session states", () => {
    it("should return loading state when session is loading", () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "loading",
      });

      const { result } = renderHook(() => useDLTAuth());

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it("should return unauthenticated state when no session", () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useDLTAuth());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBe(null);
    });

    it("should return authenticated state with user data", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          accessToken: "token-abc",
        },
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useDLTAuth());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        accessToken: "token-abc",
      });
    });

    it("should handle session with missing user fields", () => {
      const mockSession = {
        user: {},
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useDLTAuth());

      expect(result.current.user).toEqual({
        id: "",
        email: "",
        accessToken: undefined,
      });
    });
  });

  describe("Login function", () => {
    it("should call signIn with correct parameters", async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
      (signIn as jest.Mock).mockResolvedValue({ ok: true });

      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: true,
        callbackUrl: "/dlt/merchant",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should use custom callbackUrl when provided", async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
      (signIn as jest.Mock).mockResolvedValue({ ok: true });

      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.login(
          "test@example.com",
          "password123",
          "/dlt/seller"
        );
      });

      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: true,
        callbackUrl: "/dlt/seller",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("Logout function", () => {
    it("should call signOut with default callbackUrl", async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: { user: { id: "1", email: "test@test.com" } },
        status: "authenticated",
      });
      (signOut as jest.Mock).mockResolvedValue({ url: "/dlt/sign-in" });

      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(signOut).toHaveBeenCalledWith({
        redirect: true,
        callbackUrl: "/dlt/sign-in",
      });
    });

    it("should use custom callbackUrl when provided", async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: { user: { id: "1", email: "test@test.com" } },
        status: "authenticated",
      });
      (signOut as jest.Mock).mockResolvedValue({ url: "/custom" });

      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.logout("/custom");
      });

      expect(signOut).toHaveBeenCalledWith({
        redirect: true,
        callbackUrl: "/custom",
      });
    });
  });

  describe("Return values", () => {
    it("should return session and status from useSession", () => {
      const mockSession = {
        user: { id: "1", email: "test@test.com" },
        expires: "2024-01-01",
      };
      (useSession as jest.Mock).mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useDLTAuth());

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.status).toBe("authenticated");
    });
  });
});
