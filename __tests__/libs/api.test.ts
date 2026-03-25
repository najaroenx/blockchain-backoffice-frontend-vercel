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
        text: async () => JSON.stringify({ data: "success" }),
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
        text: async () => JSON.stringify({ data: "success" }),
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
        text: async () => JSON.stringify({ data: "success" }),
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
        text: async () => JSON.stringify({ data: "success" }),
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
        text: async () => JSON.stringify({ data: "success" }),
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
        text: async () =>
          JSON.stringify({ status: "ok", message: "done", data: { id: 1 } }),
      });

      const result = await api("/test", { method: "GET" });

      expect(result).toEqual({ id: 1 });
    });

    it("should return full response when unwrapData is false", async () => {
      const mockResponse = { status: "ok", message: "done", data: { id: 1 } };
      mockFetch.mockResolvedValue({
        ok: true,
        text: async () => JSON.stringify(mockResponse),
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
        text: async () => JSON.stringify(mockResponse),
      });

      const result = await api("/test", { method: "GET" });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("Error handling", () => {
    it("should throw error response with message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ message: "Bad Request" }),
      });

      await expect(api("/test", { method: "GET" })).rejects.toMatchObject({
        statusCode: 400,
        message: "Bad Request",
      });
    });

    it("should throw error response with nested data.message", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => JSON.stringify({ data: { message: "Server Error" } }),
      });

      await expect(api("/test", { method: "GET" })).rejects.toMatchObject({
        statusCode: 500,
        message: "Server Error",
      });
    });

    it("should throw error response with query params logic path", async () => {
      // Cover the 'if (fetchOptions.queryParams)' branch error handling
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => JSON.stringify({ message: "Not Found" }),
      });

      await expect(
        api("/test", {
          method: "GET",
          queryParams: { id: 1 },
        })
      ).rejects.toMatchObject({ statusCode: 404, message: "Not Found" });
    });
  });
});
