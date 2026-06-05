// __tests__/dlt/api/seller-register.test.ts

import { POST } from "@/app/api/seller/register/route";

// Mock libs
jest.mock("@/libs/api", () => ({
  api: jest.fn(),
}));

jest.mock("@/libs/errorHandler", () => ({
  handleError: jest.fn((message, statusCode) => {
    return new Response(JSON.stringify({ message }), { status: statusCode });
  }),
}));

jest.mock("@/libs/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

import { api } from "@/libs/api";
import { handleError } from "@/libs/errorHandler";

describe("POST /api/seller/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 when email is missing", async () => {
    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({ password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(handleError).toHaveBeenCalledWith(
      "Email and password are required",
      400
    );
  });

  it("should return 400 when password is missing", async () => {
    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(handleError).toHaveBeenCalledWith(
      "Email and password are required",
      400
    );
  });

  it("should return 400 for invalid email format", async () => {
    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({ email: "invalid-email", password: "password123" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(handleError).toHaveBeenCalledWith("Invalid email format", 400);
  });

  it("should return 400 when password is too short", async () => {
    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "12345" }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(handleError).toHaveBeenCalledWith(
      "Password must be at least 6 characters",
      400
    );
  });

  it("should call backend API with correct data", async () => {
    (api as jest.Mock).mockResolvedValue({ data: { id: "user-123" } });

    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(api).toHaveBeenCalledWith(
      expect.stringContaining("/auth/seller/register"),
      expect.objectContaining({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "password123",
        },
      })
    );
  });

  it("should return 201 on successful registration", async () => {
    (api as jest.Mock).mockResolvedValue({ data: { id: "user-123" } });

    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.status).toBe("success");
    expect(data.message).toBe("Registration successful");
  });

  it("should handle backend error response", async () => {
    (api as jest.Mock).mockResolvedValue({
      statusCode: 409,
      message: "Email already exists",
    });

    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);

    expect(handleError).toHaveBeenCalledWith("Email already exists", 409);
  });

  it("should return 500 on unexpected error", async () => {
    (api as jest.Mock).mockRejectedValue(new Error("Network error"));

    const request = new Request("http://localhost/api/seller/register", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.status).toBe("error");
  });
});
