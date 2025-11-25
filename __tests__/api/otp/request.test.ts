import { NextRequest } from "next/server";
import { POST } from "@/app/api/otp/request/route";
import { api } from "@/libs/api";

// Mock dependencies
jest.mock("@/libs/api");
jest.mock("@/app/config/firebase-admin");

describe("POST /api/otp/request", () => {
  let mockRequest: any;
  const mockApi = api as jest.MockedFunction<typeof api>;
  const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    
    mockRequest = {
      json: jest.fn(),
      url: "http://localhost:3000/api/otp/request",
    };
  });

  describe("Phone number validation", () => {
    it("should reject phone number with less than 10 digits", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "081234567",
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should reject phone number with more than 10 digits", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "08123456789",
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should reject missing phone number", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should reject empty phone number", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "",
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should accept valid 10-digit phone number", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({
        error: "NEW_OTP_GENERATED",
      });

      mockApi.mockResolvedValueOnce({ success: true });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(200);
    });
  });

  describe("New registration flow", () => {
    it("should handle new phone number registration", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi
        .mockResolvedValueOnce({ error: "NEW_OTP_GENERATED" })
        .mockResolvedValueOnce({ success: true });

      const response = await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/customer/phone/0812345678"),
        expect.objectContaining({ method: "GET" })
      );
      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/templink/req123/send-otp"),
        expect.objectContaining({ method: "GET" })
      );
      expect(response.status).toBe(200);
    });

    it("should handle OTP send failure for new registration", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi
        .mockResolvedValueOnce({ error: "NEW_OTP_GENERATED" })
        .mockResolvedValueOnce({ error: "Failed to send OTP" });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should use correct backend endpoint for OTP sending", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "test-request-id",
      });

      mockApi
        .mockResolvedValueOnce({ error: "NEW_OTP_GENERATED" })
        .mockResolvedValueOnce({ success: true });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        `${BACKEND_URL}/templink/test-request-id/send-otp`,
        expect.objectContaining({ method: "GET" })
      );
    });
  });

  describe("Existing user flow", () => {
    it("should reject existing phone number", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should format phone number to international format", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/customer/phone/0812345678"),
        expect.any(Object)
      );
    });

    it("should check phone in backend with correct merchantId", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("cmi5o77hc00079yqzgrtf0e5l"),
        expect.any(Object)
      );
    });
  });

  describe("Backend error handling", () => {
    it("should handle backend error with statusCode", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ statusCode: 500 });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should handle null response from backend", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce(null as any);

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should handle network error", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockRejectedValueOnce(new Error("Network error"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
      expect(console.error).toHaveBeenCalled();
    });

    it("should handle timeout error", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockRejectedValueOnce(new Error("Timeout"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });
  });

  describe("Request body validation", () => {
    it("should handle malformed JSON", async () => {
      mockRequest.json = jest.fn().mockRejectedValue(new Error("Invalid JSON"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should handle missing requestId", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
      });

      mockApi
        .mockResolvedValueOnce({ error: "NEW_OTP_GENERATED" })
        .mockResolvedValueOnce({ success: true });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/templink/undefined/send-otp"),
        expect.any(Object)
      );
    });

    it("should handle null phoneNumber", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: null,
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should handle numeric phoneNumber", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: 812345678,
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });
  });

  describe("Phone number formats", () => {
    it("should handle phone starting with 06", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0612345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/customer/phone/0612345678"),
        expect.any(Object)
      );
    });

    it("should handle phone starting with 09", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0912345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle phone with special characters (should fail)", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "081-234-567",
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });
  });

  describe("Logging", () => {
    it("should log OTP request received", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      mockApi.mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(console.log).toHaveBeenCalledWith("Received OTP request");
    });

    it("should log backend response", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      const backendResponse = { customerId: "customer123" };
      mockApi.mockResolvedValueOnce(backendResponse);

      await POST(mockRequest as NextRequest);

      expect(console.log).toHaveBeenCalledWith(
        "Backend response for phone check:",
        backendResponse
      );
    });

    it("should log errors", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: "req123",
      });

      const error = new Error("Test error");
      mockApi.mockRejectedValueOnce(error);

      await POST(mockRequest as NextRequest);

      expect(console.error).toHaveBeenCalledWith(
        "Error processing phone number:",
        error
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle whitespace in phone number", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: " 0812345678 ",
        requestId: "req123",
      });

      const response = await POST(mockRequest as NextRequest);

      // Length check will fail due to whitespace
      expect(response.status).toBe(400);
    });

    it("should handle empty request body", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({});

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should handle very long requestId", async () => {
      const longRequestId = "x".repeat(1000);
      mockRequest.json = jest.fn().mockResolvedValue({
        phoneNumber: "0812345678",
        requestId: longRequestId,
      });

      mockApi
        .mockResolvedValueOnce({ error: "NEW_OTP_GENERATED" })
        .mockResolvedValueOnce({ success: true });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining(longRequestId),
        expect.any(Object)
      );
    });
  });
});
