import { NextRequest } from "next/server";
import { GET } from "@/app/api/merchant/all/route";

// Mock fetch
global.fetch = jest.fn();

describe("GET /api/merchant/all", () => {
  let mockRequest: any;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      url: "http://localhost:3000/api/merchant/all",
    };
  });

  describe("Successful responses", () => {
    it.skip("should fetch merchants with default pagination", async () => {
      const mockData = {
        merchants: [
          { id: "1", name: "Merchant 1", location: "Bangkok" },
          { id: "2", name: "Merchant 2", location: "Chiang Mai" },
        ],
        total: 2,
        page: 1,
        limit: 20,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        `${BACKEND_URL}/merchant/all?page=1&limit=20`,
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?page=2&limit=10";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2&limit=10"),
        expect.any(Object)
      );
    });

    it.skip("should return empty merchants array when no results", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.merchants).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe("Query parameter filtering", () => {
    it("should filter by name", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?name=Central";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("name=Central"),
        expect.any(Object)
      );
    });

    it("should filter by location", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?location=Bangkok";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("location=Bangkok"),
        expect.any(Object)
      );
    });

    it("should filter by website", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?website=example.com";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("website=example.com"),
        expect.any(Object)
      );
    });

    it("should filter by hasWallet", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?hasWallet=true";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("hasWallet=true"),
        expect.any(Object)
      );
    });

    it("should filter by pointId", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?pointId=point123";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("pointId=point123"),
        expect.any(Object)
      );
    });

    it("should handle multiple filters simultaneously", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?name=Central&location=Bangkok&hasWallet=true";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("name=Central");
      expect(calledUrl).toContain("location=Bangkok");
      expect(calledUrl).toContain("hasWallet=true");
    });

    it("should ignore empty filter parameters", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?name=&location=";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).not.toContain("name=");
      expect(calledUrl).not.toContain("location=");
    });
  });

  describe("Request headers", () => {
    it("should include correct content-type header", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should not include authorization header (public endpoint)", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [] }),
      });

      await GET(mockRequest as NextRequest);

      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe("Error handling", () => {
    it.skip("should handle 404 backend error", async () => {
      const errorMessage = "Merchants not found";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: errorMessage }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe(errorMessage);
      expect(data.error).toBeDefined();
    });

    it.skip("should handle 500 backend error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: "Database error" }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Database error");
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
      expect(data.message).toBe("Failed to fetch merchants");
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
      expect(data.message).toBe("Failed to fetch merchants");
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
        "Error fetching merchants:",
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

  describe("Special characters in parameters", () => {
    it("should handle URL-encoded special characters in name", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?name=Central%20Retail";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("name=Central+Retail"),
        expect.any(Object)
      );
    });

    it("should handle Thai characters in location", async () => {
      mockRequest.url = "http://localhost:3000/api/merchant/all?location=กรุงเทพ";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("Response data validation", () => {
    it.skip("should return merchants with all fields", async () => {
      const mockData = {
        merchants: [
          {
            id: "merchant1",
            name: "Test Merchant",
            location: "Bangkok",
            website: "https://test.com",
            walletAddress: "0x123",
            createdAt: "2024-01-01",
            _count: { vouchers: 10 },
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.merchants[0]).toHaveProperty("id");
      expect(data.merchants[0]).toHaveProperty("name");
      expect(data.merchants[0]).toHaveProperty("location");
    });

    it.skip("should handle large result sets", async () => {
      const merchants = Array.from({ length: 100 }, (_, i) => ({
        id: `merchant${i}`,
        name: `Merchant ${i}`,
      }));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants, total: 100 }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.merchants).toHaveLength(100);
      expect(data.total).toBe(100);
    });
  });

  describe("Backend URL configuration", () => {
    it("should use configured BACKEND_URL", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ merchants: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(BACKEND_URL),
        expect.any(Object)
      );
    });
  });
});
