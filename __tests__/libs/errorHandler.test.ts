import { handleError } from "@/libs/errorHandler";

// Mock Response.json for Node environment
global.Response = class Response {
  body: any;
  status: number;
  headers: Map<string, string>;

  constructor(body: any, init?: { status?: number; headers?: Record<string, string> }) {
    this.body = body;
    this.status = init?.status ?? 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
    this.headers.set("Content-Type", "application/json");
  }

  static json(data: any, init?: { status?: number }) {
    return new Response(JSON.stringify(data), init);
  }

  async json() {
    return JSON.parse(this.body);
  }
} as any;

describe("handleError utility", () => {
  describe("Error responses", () => {
    it("should return 400 Bad Request response", () => {
      const result = handleError("Invalid input data", 400);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(400);
    });

    it("should return 401 Unauthorized response", () => {
      const result = handleError("Unauthorized access", 401);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(401);
    });

    it("should return 403 Forbidden response", () => {
      const result = handleError("Access forbidden", 403);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(403);
    });

    it("should return 404 Not Found response", () => {
      const result = handleError("Resource not found", 404);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(404);
    });

    it("should return 422 Unprocessable Entity response", () => {
      const result = handleError("Validation failed", 422);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(422);
    });

    it("should return 500 Internal Server Error response", () => {
      const result = handleError("Internal server error", 500);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(500);
    });

    it("should return 503 Service Unavailable response", () => {
      const result = handleError("Service unavailable", 503);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(503);
    });
  });

  describe("Response body", () => {
    it("should include error message in response body", async () => {
      const errorMessage = "Test error message";
      const result = handleError(errorMessage, 400);
      
      const body = await result.json();
      expect(body).toEqual({ message: errorMessage });
    });

    it("should handle empty error message", async () => {
      const result = handleError("", 500);
      
      const body = await result.json();
      expect(body).toEqual({ message: "" });
    });

    it("should handle long error message", async () => {
      const longMessage = "This is a very long error message ".repeat(10);
      const result = handleError(longMessage, 400);
      
      const body = await result.json();
      expect(body).toEqual({ message: longMessage });
    });

    it("should handle special characters in message", async () => {
      const specialMessage = 'Error with "quotes" and \'apostrophes\' & symbols <>';
      const result = handleError(specialMessage, 400);
      
      const body = await result.json();
      expect(body).toEqual({ message: specialMessage });
    });

    it("should handle unicode characters in message", async () => {
      const unicodeMessage = "ข้อผิดพลาด: ไม่พบข้อมูล 😀 🎉";
      const result = handleError(unicodeMessage, 404);
      
      const body = await result.json();
      expect(body).toEqual({ message: unicodeMessage });
    });
  });

  describe("Response headers", () => {
    it("should have Content-Type application/json", () => {
      const result = handleError("Test error", 400);
      
      expect(result.headers.get("Content-Type")).toBe("application/json");
    });
  });

  describe("Edge cases", () => {
    it("should handle status code 0", () => {
      const result = handleError("Unknown error", 0);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(0);
    });

    it("should handle very high status code", () => {
      const result = handleError("Custom error", 999);
      
      expect(result).toBeInstanceOf(Response);
      expect(result.status).toBe(999);
    });

    it("should be callable multiple times", async () => {
      const result1 = handleError("Error 1", 400);
      const result2 = handleError("Error 2", 500);
      
      expect(result1.status).toBe(400);
      expect(result2.status).toBe(500);
      
      const body1 = await result1.json();
      const body2 = await result2.json();
      
      expect(body1.message).toBe("Error 1");
      expect(body2.message).toBe("Error 2");
    });
  });

  describe("Common use cases", () => {
    it("should handle authentication error", async () => {
      const result = handleError("Invalid credentials", 401);
      
      expect(result.status).toBe(401);
      const body = await result.json();
      expect(body.message).toBe("Invalid credentials");
    });

    it("should handle validation error", async () => {
      const result = handleError("Email is required", 422);
      
      expect(result.status).toBe(422);
      const body = await result.json();
      expect(body.message).toBe("Email is required");
    });

    it("should handle database error", async () => {
      const result = handleError("Database connection failed", 500);
      
      expect(result.status).toBe(500);
      const body = await result.json();
      expect(body.message).toBe("Database connection failed");
    });

    it("should handle rate limit error", async () => {
      const result = handleError("Too many requests", 429);
      
      expect(result.status).toBe(429);
      const body = await result.json();
      expect(body.message).toBe("Too many requests");
    });
  });
});
