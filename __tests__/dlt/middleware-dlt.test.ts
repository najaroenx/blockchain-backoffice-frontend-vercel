// __tests__/dlt/middleware-dlt.test.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import middleware from "@/middleware";

// Mock next-auth/jwt
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

// Mock Next.js server components
jest.mock("next/server", () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(() => ({ type: "next" })),
    redirect: jest.fn((url) => ({ type: "redirect", url })),
  },
}));

describe("middleware - DLT routes", () => {
  let mockRequest: Partial<NextRequest>;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.DLT_REQUIRE_AUTH = "true";

    const baseUrl = new URL("http://localhost:3000/");
    mockRequest = {
      nextUrl: baseUrl as any,
      cookies: {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
      } as any,
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Protected DLT routes - /dlt/merchant", () => {
    it("should redirect to /dlt/sign-in when accessing /dlt/merchant without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/merchant";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt/sign-in"),
        })
      );
    });

    it("should redirect to /dlt/sign-in for nested merchant routes", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/merchant/123/point/create";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt/sign-in"),
        })
      );
    });

    it("should allow access to /dlt/merchant with valid token", async () => {
      const validToken = {
        data: {
          valid_until: Math.floor(Date.now() / 1000) + 3600,
        },
      };
      (getToken as jest.Mock).mockResolvedValue(validToken);
      mockRequest.nextUrl!.pathname = "/dlt/merchant";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe("Protected DLT routes - /dlt/seller", () => {
    it("should redirect to /dlt/sign-in when accessing /dlt/seller without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/seller";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt/sign-in"),
        })
      );
    });

    it("should redirect to /dlt/sign-in for nested seller routes", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/seller/products/list";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt/sign-in"),
        })
      );
    });

    it("should allow access to /dlt/seller with valid token", async () => {
      const validToken = {
        data: {
          valid_until: Math.floor(Date.now() / 1000) + 3600,
        },
      };
      (getToken as jest.Mock).mockResolvedValue(validToken);
      mockRequest.nextUrl!.pathname = "/dlt/seller";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe("Unprotected DLT routes", () => {
    it("should allow access to /dlt without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it("should allow access to /dlt/sign-in without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/sign-in";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it("should allow access to /dlt/sign-up without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/sign-up";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });

    it("should allow access to /dlt/pricing without token", async () => {
      (getToken as jest.Mock).mockResolvedValue(null);
      mockRequest.nextUrl!.pathname = "/dlt/pricing";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe("DLT auth redirect routes", () => {
    it("should redirect authenticated users away from /dlt/sign-in", async () => {
      const validToken = {
        data: {
          valid_until: Math.floor(Date.now() / 1000) + 3600,
        },
      };
      (getToken as jest.Mock).mockResolvedValue(validToken);
      mockRequest.nextUrl!.pathname = "/dlt/sign-in";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt"),
        })
      );
    });

    it("should redirect authenticated users away from /dlt/sign-up", async () => {
      const validToken = {
        data: {
          valid_until: Math.floor(Date.now() / 1000) + 3600,
        },
      };
      (getToken as jest.Mock).mockResolvedValue(validToken);
      mockRequest.nextUrl!.pathname = "/dlt/sign-up";

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt"),
        })
      );
    });
  });

  describe("Token expiration for DLT routes", () => {
    it("should redirect to /dlt/sign-in when token is expired on DLT routes", async () => {
      const expiredToken = {
        data: {
          valid_until: Math.floor(Date.now() / 1000) - 3600,
        },
      };
      (getToken as jest.Mock).mockResolvedValue(expiredToken);
      mockRequest.nextUrl!.pathname = "/dlt/merchant";

      const mockRedirectResponse = {
        type: "redirect",
        cookies: {
          set: jest.fn(),
        },
      };
      (NextResponse.redirect as jest.Mock).mockReturnValue(
        mockRedirectResponse
      );

      await middleware(mockRequest as NextRequest);

      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          href: expect.stringContaining("/dlt/sign-in"),
        })
      );
    });
  });
});
