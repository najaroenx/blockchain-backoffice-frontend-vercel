import { NextRequest } from "next/server";
import { POST } from "@/app/api/otp/verify/route";
import { api } from "@/libs/api";

// Mock dependencies
jest.mock("@/libs/api");

describe("POST /api/otp/verify", () => {
  let mockRequest: any;
  const mockApi = api as jest.MockedFunction<typeof api>;
  const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();

    mockRequest = {
      json: jest.fn(),
      url: "http://localhost:3000/api/otp/verify",
    };
  });

  describe("Successful OTP verification", () => {
    it("should verify OTP successfully", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true }) // OTP verification
        .mockResolvedValueOnce({ customerId: "customer123" }); // Customer creation

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(200);
      expect(mockApi).toHaveBeenCalledTimes(2);
    });

    it("should call backend OTP verification endpoint", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "654321",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        `${BACKEND_URL}/templink/verify-otp`,
        expect.objectContaining({
          method: "POST",
          body: {
            phoneNumber: "0812345678",
            otpCode: "654321",
          },
        })
      );
    });

    it("should create customer after successful OTP verification", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "new-customer" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        `${BACKEND_URL}/merchant123/customer`,
        expect.objectContaining({
          method: "POST",
          body: expect.objectContaining({
            tel: "0812345678",
            email: expect.stringMatching(/^user[a-z0-9]{5}@example\.com$/),
          }),
        })
      );
    });

    it("should generate random email for customer", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      const customerCreateCall = mockApi.mock.calls.find((call) =>
        call[0].includes("/customer")
      );
      expect(customerCreateCall).toBeDefined();
      if (customerCreateCall) {
        expect(customerCreateCall[1].body.email).toMatch(/^user[a-z0-9]{5}@example\.com$/);
      }
    });

    it("should generate unique emails on multiple calls", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      const emails = new Set();

      for (let i = 0; i < 10; i++) {
        jest.clearAllMocks();
        mockRequest.json = jest.fn().mockResolvedValue(requestBody);
        mockApi
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ customerId: `customer${i}` });

        await POST(mockRequest as NextRequest);

        const customerCreateCall = mockApi.mock.calls.find((call) =>
          call[0].includes("/customer")
        );
        if (customerCreateCall) {
          emails.add(customerCreateCall[1].body.email);
        }
      }

      // Should have some variety (not all same)
      expect(emails.size).toBeGreaterThan(1);
    });
  });

  describe("OTP verification failure", () => {
    it("should reject invalid OTP code", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "wrong",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockResolvedValueOnce({ statusCode: 400 });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should not create customer if OTP is invalid", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "invalid",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockResolvedValueOnce({ statusCode: 400 });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledTimes(1);
      expect(mockApi).not.toHaveBeenCalledWith(
        expect.stringContaining("/customer"),
        expect.any(Object)
      );
    });

    it("should handle expired OTP", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockResolvedValueOnce({
        statusCode: 400,
        message: "OTP expired",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });

    it("should handle OTP already used", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockResolvedValueOnce({
        statusCode: 400,
        message: "OTP already used",
      });

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(400);
    });
  });

  describe("Error handling", () => {
    it("should handle network error during OTP verification", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockRejectedValueOnce(new Error("Network error"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
      expect(console.error).toHaveBeenCalledWith(
        "Error verifying OTP:",
        expect.any(Error)
      );
    });

    it("should handle network error during customer creation", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should handle malformed request body", async () => {
      mockRequest.json = jest.fn().mockRejectedValue(new Error("Invalid JSON"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });

    it("should handle timeout error", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockRejectedValueOnce(new Error("Timeout"));

      const response = await POST(mockRequest as NextRequest);

      expect(response.status).toBe(500);
    });
  });

  describe("Request validation", () => {
    it("should handle missing phoneNumber", async () => {
      const requestBody = {
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.objectContaining({
            phoneNumber: undefined,
          }),
        })
      );
    });

    it("should handle missing merchantId", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        `${BACKEND_URL}/undefined/customer`,
        expect.any(Object)
      );
    });

    it("should handle missing otpCode", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("/templink/verify-otp"),
        expect.objectContaining({
          body: expect.objectContaining({
            otpCode: undefined,
          }),
        })
      );
    });

    it("should handle empty strings", async () => {
      const requestBody = {
        phoneNumber: "",
        merchantId: "",
        otpCode: "",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });
  });

  describe("Phone number formats", () => {
    it("should handle different phone number formats", async () => {
      const phoneNumbers = [
        "0812345678",
        "0612345678",
        "0912345678",
        "0821234567",
      ];

      for (const phone of phoneNumbers) {
        jest.clearAllMocks();
        mockRequest.json = jest.fn().mockResolvedValue({
          phoneNumber: phone,
          merchantId: "merchant123",
          otpCode: "123456",
        });

        mockApi
          .mockResolvedValueOnce({ success: true })
          .mockResolvedValueOnce({ customerId: "customer123" });

        await POST(mockRequest as NextRequest);

        expect(mockApi).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: expect.objectContaining({
              tel: phone,
            }),
          })
        );
      }
    });

    it("should handle international format phone number", async () => {
      const requestBody = {
        phoneNumber: "+66812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.objectContaining({
            tel: "+66812345678",
          }),
        })
      );
    });
  });

  describe("Merchant ID validation", () => {
    it("should use correct merchant endpoint", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "test-merchant-456",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        `${BACKEND_URL}/test-merchant-456/customer`,
        expect.any(Object)
      );
    });

    it("should handle special characters in merchantId", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant-123_test",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.stringContaining("merchant-123_test"),
        expect.any(Object)
      );
    });
  });

  describe("OTP code validation", () => {
    it("should handle 6-digit OTP", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.objectContaining({
            otpCode: "123456",
          }),
        })
      );
    });

    it("should handle 4-digit OTP", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "1234",
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle numeric OTP code", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: 123456,
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });
  });

  describe("Logging", () => {
    it("should log OTP verification response", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      const verifyResponse = { success: true, verified: true };
      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce(verifyResponse)
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(console.log).toHaveBeenCalledWith(
        "OTP Verification Response:",
        verifyResponse
      );
    });

    it("should log errors", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
      };

      const error = new Error("Test error");
      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi.mockRejectedValueOnce(error);

      await POST(mockRequest as NextRequest);

      expect(console.error).toHaveBeenCalledWith("Error verifying OTP:", error);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty request body", async () => {
      mockRequest.json = jest.fn().mockResolvedValue({});
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle null values", async () => {
      const requestBody = {
        phoneNumber: null,
        merchantId: null,
        otpCode: null,
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle very long OTP code", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "1".repeat(100),
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });

    it("should handle additional unexpected fields", async () => {
      const requestBody = {
        phoneNumber: "0812345678",
        merchantId: "merchant123",
        otpCode: "123456",
        extraField: "should be ignored",
        anotherField: 12345,
      };

      mockRequest.json = jest.fn().mockResolvedValue(requestBody);
      mockApi
        .mockResolvedValueOnce({ success: true })
        .mockResolvedValueOnce({ customerId: "customer123" });

      await POST(mockRequest as NextRequest);

      expect(mockApi).toHaveBeenCalled();
    });
  });
});
