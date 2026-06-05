import { renderHook, act } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next-auth/react
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();
const mockUseSession = jest.fn();

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: any[]) => mockSignIn(...args),
  signOut: (...args: any[]) => mockSignOut(...args),
}));

import { useDLTAuth } from "@/app/dlt/hooks/useDLTAuth";

describe("useDLTAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when user is not authenticated", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
    });

    it("should return null user", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.user).toBeNull();
    });

    it("should return isAuthenticated as false", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("should return isLoading as false", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("when session is loading", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
      });
    });

    it("should return isLoading as true", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "user-123",
            email: "test@example.com",
            accessToken: "token-abc",
          },
        },
        status: "authenticated",
      });
    });

    it("should return user data", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.user).toEqual({
        id: "user-123",
        email: "test@example.com",
        accessToken: "token-abc",
      });
    });

    it("should return isAuthenticated as true", () => {
      const { result } = renderHook(() => useDLTAuth());
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("login function", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
    });

    it("should call signIn with credentials", async () => {
      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.login("test@example.com", "password123");
      });

      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        redirect: true,
        callbackUrl: "/dlt/merchant",
        email: "test@example.com",
        password: "password123",
      });
    });

    it("should use custom callbackUrl", async () => {
      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.login(
          "test@example.com",
          "password123",
          "/dlt/seller",
        );
      });

      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        redirect: true,
        callbackUrl: "/dlt/seller",
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  describe("logout function", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({
        data: {
          user: { id: "user-123", email: "test@example.com" },
        },
        status: "authenticated",
      });
    });

    it("should call signOut with default callbackUrl", async () => {
      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockSignOut).toHaveBeenCalledWith({
        redirect: true,
        callbackUrl: "/dlt/sign-in",
      });
    });

    it("should use custom callbackUrl", async () => {
      const { result } = renderHook(() => useDLTAuth());

      await act(async () => {
        await result.current.logout("/");
      });

      expect(mockSignOut).toHaveBeenCalledWith({
        redirect: true,
        callbackUrl: "/",
      });
    });
  });
});
