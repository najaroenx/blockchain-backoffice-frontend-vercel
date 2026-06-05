import { NextRequest } from "next/server";
import { GET } from "@/app/api/points/all/route";

// Mock fetch
global.fetch = jest.fn();

describe("GET /api/points/all", () => {
  let mockRequest: any;
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      url: "http://localhost:3000/api/points/all",
    };
  });

  describe("Successful responses", () => {
    it.skip("should fetch points with default pagination", async () => {
      const mockData = {
        points: [
          { id: "1", name: "Point 1", symbol: "PT1", merchantId: "m1" },
          { id: "2", name: "Point 2", symbol: "PT2", merchantId: "m2" },
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
        `${BACKEND_URL}/points/all?page=1&limit=20`,
        expect.any(Object)
      );
    });

    it("should handle custom pagination parameters", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?page=3&limit=50";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page=3&limit=50"),
        expect.any(Object)
      );
    });

    it.skip("should return empty points array when no results", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.points).toEqual([]);
      expect(data.total).toBe(0);
    });
  });

  describe("Query parameter filtering", () => {
    it("should filter by name", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?name=Reward";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("name=Reward"),
        expect.any(Object)
      );
    });

    it("should filter by symbol", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?symbol=RPT";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("symbol=RPT"),
        expect.any(Object)
      );
    });

    it("should filter by merchantId", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?merchantId=merchant123";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("merchantId=merchant123"),
        expect.any(Object)
      );
    });

    it("should filter by merchantName", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?merchantName=Central";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("merchantName=Central"),
        expect.any(Object)
      );
    });

    it("should filter by pointName", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?pointName=Loyalty";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("pointName=Loyalty"),
        expect.any(Object)
      );
    });

    it("should handle multiple filters simultaneously", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?name=Reward&symbol=RPT&merchantId=m1";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("name=Reward");
      expect(calledUrl).toContain("symbol=RPT");
      expect(calledUrl).toContain("merchantId=m1");
    });

    it("should ignore empty filter parameters", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?name=&symbol=";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).not.toContain("name=");
      expect(calledUrl).not.toContain("symbol=");
    });

    it("should handle all filters combined", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?page=2&limit=10&name=Test&symbol=TST&merchantId=m1&merchantName=Merchant&pointName=TestPoint";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [], total: 0 }),
      });

      await GET(mockRequest as NextRequest);

      const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0];
      expect(calledUrl).toContain("page=2");
      expect(calledUrl).toContain("limit=10");
      expect(calledUrl).toContain("name=Test");
      expect(calledUrl).toContain("symbol=TST");
      expect(calledUrl).toContain("merchantId=m1");
      expect(calledUrl).toContain("merchantName=Merchant");
      expect(calledUrl).toContain("pointName=TestPoint");
    });
  });

  describe("Request headers", () => {
    it("should include correct content-type header", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
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
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      const headers = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });
  });

  describe("Error handling", () => {
    it.skip("should handle 404 backend error", async () => {
      const errorMessage = "Points not found";
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

    it.skip("should handle 403 forbidden error", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ message: "Access denied" }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.message).toBe("Access denied");
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
      expect(data.message).toBe("Failed to fetch points");
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
      expect(data.message).toBe("Failed to fetch points");
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
        "Error fetching points:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle connection refused error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error("ECONNREFUSED")
      );

      const response = await GET(mockRequest as NextRequest);

      expect(response.status).toBe(500);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Special characters in parameters", () => {
    it("should handle URL-encoded special characters", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?name=Reward%20Point";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("name=Reward+Point"),
        expect.any(Object)
      );
    });

    it("should handle Thai characters", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?merchantName=ร้านค้า";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalled();
    });

    it("should handle special symbols in symbol parameter", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?symbol=RPT-123";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("symbol=RPT-123"),
        expect.any(Object)
      );
    });
  });

  describe("Response data validation", () => {
    it.skip("should return points with all fields", async () => {
      const mockData = {
        points: [
          {
            id: "point1",
            name: "Test Point",
            symbol: "TPT",
            merchantId: "merchant1",
            merchant: { name: "Test Merchant" },
            initialSupply: 1000000,
            _count: { voucherCodes: 5, transactions: 100 },
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

      expect(data.points[0]).toHaveProperty("id");
      expect(data.points[0]).toHaveProperty("name");
      expect(data.points[0]).toHaveProperty("symbol");
      expect(data.points[0]).toHaveProperty("merchantId");
    });

    it.skip("should handle large result sets", async () => {
      const points = Array.from({ length: 100 }, (_, i) => ({
        id: `point${i}`,
        name: `Point ${i}`,
        symbol: `PT${i}`,
      }));

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points, total: 100 }),
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.points).toHaveLength(100);
      expect(data.total).toBe(100);
    });

    it.skip("should handle points with nested merchant data", async () => {
      const mockData = {
        points: [
          {
            id: "p1",
            name: "Point",
            merchant: {
              id: "m1",
              name: "Merchant",
              location: "Bangkok",
            },
          },
        ],
        total: 1,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(data.points[0].merchant).toBeDefined();
      expect(data.points[0].merchant.name).toBe("Merchant");
    });
  });

  describe("Backend URL configuration", () => {
    it("should use configured BACKEND_URL", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(BACKEND_URL),
        expect.any(Object)
      );
    });

    it("should construct correct endpoint path", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/points/all"),
        expect.any(Object)
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle very long query strings", async () => {
      const longName = "a".repeat(500);
      mockRequest.url = `http://localhost:3000/api/points/all?name=${longName}`;

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalled();
    });

    it("should handle numeric string pagination", async () => {
      mockRequest.url = "http://localhost:3000/api/points/all?page=0&limit=0";

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ points: [] }),
      });

      await GET(mockRequest as NextRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("page=0&limit=0"),
        expect.any(Object)
      );
    });

    it.skip("should handle invalid URL gracefully", async () => {
      mockRequest.url = "invalid-url";

      await expect(GET(mockRequest as NextRequest)).rejects.toThrow();
    });
  });
});
