import { api } from "@/libs/api";

// Mock fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("api utility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("queryParams handling", () => {
    it("should append query params with ? when url has no params", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await api("/test", {
        method: "GET",
        queryParams: { page: 1, limit: 10 },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/test?page=1&limit=10"),
        expect.anything(),
      );
    });

    it("should append query params with & when url already has params", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await api("/test?existing=true", {
        method: "GET",
        queryParams: { page: 1 },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/test?existing=true&page=1"),
        expect.anything(),
      );
    });
  });

  describe("Request options", () => {
    it("should set default headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await api("/test", { method: "POST" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should merge custom headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await api("/test", {
        method: "GET",
        headers: { Authorization: "Bearer token" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer token",
          }),
        }),
      );
    });

    it("should stringify body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ data: "success" }),
      });

      await api("/test", {
        method: "POST",
        body: { foo: "bar" },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          body: JSON.stringify({ foo: "bar" }),
        }),
      );
    });
  });

  describe("Response handling", () => {
    it("should unwrap data by default when data key exists", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ status: "ok", message: "done", data: { id: 1 } }),
      });

      const result = await api("/test", { method: "GET" });

      expect(result).toEqual({ id: 1 });
    });

    it("should return full response when unwrapData is false", async () => {
      const mockResponse = { status: "ok", message: "done", data: { id: 1 } };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("/test", {
        method: "GET",
        unwrapData: false,
      });

      expect(result).toEqual(mockResponse);
    });

    it("should return response as is when data key missing", async () => {
      const mockResponse = { other: "field" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api("/test", { method: "GET" });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error handling", () => {
    it("should handle error response with message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bad Request" }),
      });

      const result = await api("/test", { method: "GET" });

      expect(result).toEqual({ statusCode: 400, message: "Bad Request" });
    });

    it("should handle error response with nested data.message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ data: { message: "Server Error" } }),
      });

      const result = await api("/test", { method: "GET" });

      expect(result).toEqual({ statusCode: 500, message: "Server Error" });
    });

    it("should handle error response with query params logic path", async () => {
      // Cover the 'if (fetchOptions.queryParams)' branch error handling
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: "Not Found" }),
      });

      const result = await api("/test", {
        method: "GET",
        queryParams: { id: 1 },
      });

      expect(result).toEqual({ statusCode: 404, message: "Not Found" });
    });
  });
});
