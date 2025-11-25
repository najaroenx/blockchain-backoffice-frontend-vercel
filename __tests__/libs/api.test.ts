import { api } from "@/libs/api";

// Mock fetch
global.fetch = jest.fn();

describe("api utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET requests", () => {
    it("should make a successful GET request without query params", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test", {
        method: "GET",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: undefined,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should make a successful GET request with query params", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test", {
        method: "GET",
        queryParams: { page: 1, limit: 10, search: "test" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test?page=1&limit=10&search=test",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: undefined,
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle multiple query params with different types", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "GET",
        queryParams: { 
          page: 1, 
          limit: "20", 
          active: "true",
          merchantId: "merchant123"
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test?page=1&limit=20&active=true&merchantId=merchant123",
        expect.any(Object)
      );
    });
  });

  describe("POST requests", () => {
    it("should make a successful POST request with body", async () => {
      const mockResponse = { id: "123", message: "Created" };
      const requestBody = { name: "Test", email: "test@example.com" };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test", {
        method: "POST",
        body: requestBody,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it("should make a POST request with custom headers", async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "POST",
        headers: {
          Authorization: "Bearer token123",
          "X-Custom-Header": "custom-value",
        },
        body: { data: "test" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer token123",
            "X-Custom-Header": "custom-value",
          },
          body: JSON.stringify({ data: "test" }),
        }
      );
    });
  });

  describe("PUT/PATCH requests", () => {
    it("should make a successful PUT request", async () => {
      const mockResponse = { updated: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test/123", {
        method: "PUT",
        body: { name: "Updated" },
      });

      expect(result).toEqual(mockResponse);
    });

    it("should make a successful PATCH request", async () => {
      const mockResponse = { patched: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test/123", {
        method: "PATCH",
        body: { status: "active" },
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("DELETE requests", () => {
    it("should make a successful DELETE request", async () => {
      const mockResponse = { deleted: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("https://example.com/api/test/123", {
        method: "DELETE",
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error handling", () => {
    it("should handle 400 error response", async () => {
      const errorMessage = "Bad request";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage }),
      });

      const result = await api("https://example.com/api/test", {
        method: "POST",
        body: { invalid: "data" },
      });

      expect(result).toEqual({
        statusCode: 400,
        message: errorMessage,
      });
    });

    it("should handle 401 unauthorized error", async () => {
      const errorMessage = "Unauthorized";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: errorMessage }),
      });

      const result = await api("https://example.com/api/test", {
        method: "GET",
      });

      expect(result).toEqual({
        statusCode: 401,
        message: errorMessage,
      });
    });

    it("should handle 404 not found error", async () => {
      const errorMessage = "Not found";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: errorMessage }),
      });

      const result = await api("https://example.com/api/test/999", {
        method: "GET",
      });

      expect(result).toEqual({
        statusCode: 404,
        message: errorMessage,
      });
    });

    it("should handle 500 server error", async () => {
      const errorMessage = "Internal server error";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: errorMessage }),
      });

      const result = await api("https://example.com/api/test", {
        method: "POST",
        body: { data: "test" },
      });

      expect(result).toEqual({
        statusCode: 500,
        message: errorMessage,
      });
    });

    it("should handle error with query params", async () => {
      const errorMessage = "Invalid query parameters";
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: errorMessage }),
      });

      const result = await api("https://example.com/api/test", {
        method: "GET",
        queryParams: { invalid: "param" },
      });

      expect(result).toEqual({
        statusCode: 400,
        message: errorMessage,
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle request without body", async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "POST",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        expect.objectContaining({
          body: undefined,
        })
      );
    });

    it("should handle empty query params object", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "GET",
        queryParams: {},
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test",
        expect.any(Object)
      );
    });

    it("should handle numeric values in query params", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "GET",
        queryParams: { page: 0, limit: 100 },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        "https://example.com/api/test?page=0&limit=100",
        expect.any(Object)
      );
    });

    it("should preserve custom headers with query params", async () => {
      const mockResponse = { data: "test" };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api("https://example.com/api/test", {
        method: "GET",
        queryParams: { search: "test" },
        headers: { Authorization: "Bearer token" },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("search=test"),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer token",
          }),
        })
      );
    });
  });
});
