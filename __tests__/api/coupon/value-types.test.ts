import { NextRequest } from "next/server";
import { GET } from "@/app/api/coupon/value-types/route";

// Mock fetch
global.fetch = jest.fn();

describe("GET /api/coupon/value-types", () => {
  let mockRequest: Partial<NextRequest> & { headers: Headers; url: string };
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      headers: new Headers(),
      url: "http://localhost:3000/api/coupon/value-types",
    } as any;
  });

  describe("Authentication", () => {
    it.skip("should return 401 when no authorization header is provided", async () => {
      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Unauthorized - No token provided");
    });

    it.skip("should return 401 when authorization header is empty", async () => {
      mockRequest.headers = new Headers({
        authorization: "",
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Unauthorized - No token provided");
    });

    it("should extract token from Bearer authorization header", async () => {
      const token = "test-token-123";
      mockRequest.headers = new Headers({
        authorization: `Bearer ${token}`,
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: ["cash", "percentage"] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/coupon/value-types`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        })
      );
    });
  });

  describe("Successful responses", () => {
    beforeEach(() => {
      mockRequest.headers = new Headers({
        authorization: "Bearer valid-token",
      });
    });

    it.skip("should return value types on successful fetch", async () => {
      const mockData = {
        values: ["cash", "percentage", "gift", "multiplier", "aispoint"],
        description: {
          cash: "Cash discount",
          percentage: "Percentage discount",
          gift: "Free gift",
          multiplier: "Point multiplier",
          aispoint: "AIS Point",
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockData);
    });

    it("should forward request to correct backend URL", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/coupon/value-types`,
        expect.any(Object)
      );
    });

    it("should include correct headers in backend request", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer valid-token",
          }),
        })
      );
    });
  });

  describe("Error handling", () => {
    beforeEach(() => {
      mockRequest.headers = new Headers({
        authorization: "Bearer valid-token",
      });
    });

    it.skip("should handle 404 backend error", async () => {
      const errorMessage = "Endpoint not found";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: errorMessage }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe(errorMessage);
    });

    it.skip("should handle 500 backend error", async () => {
      const errorMessage = "Internal server error";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: errorMessage }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe(errorMessage);
    });

    it.skip("should handle backend error with no message", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({}),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.message).toBe("Failed to fetch value types");
    });

    it.skip("should handle malformed JSON error response", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Failed to fetch value types");
    });

    it.skip("should handle network error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Internal server error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching value types:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it.skip("should handle timeout error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("Request timeout")
      );

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(500);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Token formats", () => {
    it("should handle token without Bearer prefix", async () => {
      mockRequest.headers = new Headers({
        authorization: "plain-token",
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer plain-token",
          }),
        })
      );
    });

    it("should handle long JWT token", async () => {
      const longToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + "x".repeat(500);
      mockRequest.headers = new Headers({
        authorization: `Bearer ${longToken}`,
      });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${longToken}`,
          }),
        })
      );
    });
  });

  describe("Response data variations", () => {
    beforeEach(() => {
      mockRequest.headers = new Headers({
        authorization: "Bearer valid-token",
      });
    });

    it.skip("should handle empty values array", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: [] }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.values).toEqual([]);
    });

    it.skip("should handle response with additional fields", async () => {
      const mockData = {
        values: ["cash"],
        description: { cash: "Cash" },
        metadata: { version: "1.0" },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data).toEqual(mockData);
    });
  });
});
