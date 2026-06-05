import { POST } from "@/app/api/register/route";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

// Mock dependencies
jest.mock("@/libs/api");
jest.mock("@/libs/logger");

describe("POST /api/register", () => {
  let mockRequest: Partial<Request>;
  const mockApi = api as jest.MockedFunction<typeof api>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn(),
      method: "POST",
      url: "http://localhost:3000/api/register",
    } as any;
  });

  describe("Successful registration", () => {
    it("should register user successfully", async () => {
      const requestBody = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      const response = await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          body: requestBody,
        })
      );
      expect(response.status).toBe(201);
      expect(logger.info).toHaveBeenCalled();
    });

    it("should pass all registration fields to backend", async () => {
      const requestBody = {
        email: "user@test.com",
        password: "secure123",
        name: "John Doe",
        phoneNumber: "0812345678",
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: requestBody,
        })
      );
    });

    it("should use configured BACKEND_URL", async () => {
      const requestBody = { email: "test@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      const backendUrl = process.env.MERCHANT_BACKEND || "http://localhost:4000";
      expect(mockApi).toHaveBeenCalledWith(
        `${backendUrl}/auth/register`,
        expect.any(Object)
      );
    });
  });

  describe("Error handling", () => {
    it("should handle backend error with status code", async () => {
      const requestBody = { email: "test@example.com" };
      const errorResponse = {
        statusCode: 400,
        message: "Invalid email format",
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce(errorResponse);

      const response = await POST(mockRequest as Request);

      expect(response.status).toBe(400);
    });

    it("should handle 409 conflict (user already exists)", async () => {
      const requestBody = { email: "existing@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({
        statusCode: 409,
        message: "User already exists",
      });

      const response = await POST(mockRequest as Request);

      expect(response.status).toBe(409);
    });

    it("should handle network error", async () => {
      const requestBody = { email: "test@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockRejectedValueOnce(new Error("Network error"));

      const response = await POST(mockRequest as Request);

      expect(response.status).toBe(500);
      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle malformed request body", async () => {
      (mockRequest.json as jest.Mock).mockRejectedValueOnce(
        new Error("Invalid JSON")
      );

      // The route doesn't wrap req.json() in try-catch, so error propagates
      await expect(POST(mockRequest as Request)).rejects.toThrow("Invalid JSON");
    });

    it("should handle backend timeout", async () => {
      const requestBody = { email: "test@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockRejectedValueOnce(new Error("Timeout"));

      const response = await POST(mockRequest as Request);

      expect(response.status).toBe(500);
    });

    it("should handle empty request body", async () => {
      (mockRequest.json as jest.Mock).mockResolvedValueOnce({});
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: {},
        })
      );
    });
  });

  describe("Request validation", () => {
    it("should log request method and URL", async () => {
      const requestBody = { email: "test@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("POST")
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining(mockRequest.url!)
      );
    });

    it("should handle special characters in request body", async () => {
      const requestBody = {
        email: "test+tag@example.com",
        name: "John O'Brien",
        password: "p@ssw0rd!",
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: requestBody,
        })
      );
    });

    it("should handle Unicode characters in name", async () => {
      const requestBody = {
        email: "test@example.com",
        name: "สมชาย ใจดี",
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: requestBody,
        })
      );
    });
  });

  describe("Backend response handling", () => {
    it("should handle successful response without statusCode", async () => {
      const requestBody = { email: "test@example.com" };
      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true, userId: "123" });

      const response = await POST(mockRequest as Request);

      expect(response.status).toBe(201);
    });

    it("should handle different error status codes", async () => {
      const testCases = [
        { statusCode: 400, message: "Bad request" },
        { statusCode: 401, message: "Unauthorized" },
        { statusCode: 500, message: "Internal server error" },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();
        const requestBody = { email: "test@example.com" };
        (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
        mockApi.mockResolvedValueOnce(testCase);

        const response = await POST(mockRequest as Request);

        expect(response.status).toBe(testCase.statusCode);
      }
    });
  });

  describe("Edge cases", () => {
    it("should handle very long email addresses", async () => {
      const longEmail = "a".repeat(200) + "@example.com";
      const requestBody = { email: longEmail };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle request with additional unexpected fields", async () => {
      const requestBody = {
        email: "test@example.com",
        password: "password123",
        unexpectedField: "should be passed through",
        anotherField: 12345,
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: requestBody,
        })
      );
    });

    it("should handle null values in request body", async () => {
      const requestBody = {
        email: "test@example.com",
        name: null,
        phoneNumber: null,
      };

      (mockRequest.json as jest.Mock).mockResolvedValueOnce(requestBody);
      mockApi.mockResolvedValueOnce({ success: true });

      await POST(mockRequest as Request);

      expect(mockApi).toHaveBeenCalled();
    });
  });
});
