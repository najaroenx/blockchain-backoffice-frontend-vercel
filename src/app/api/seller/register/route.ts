import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.DLT_BACKEND || "http://localhost:4000";

export interface RegisterSellerRequest {
  email: string;
  password: string;
}

export async function POST(req: Request) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const body = (await req.json()) as RegisterSellerRequest;

    // Validate required fields
    if (!body.email || !body.password) {
      return handleError("Email and password are required", 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return handleError("Invalid email format", 400);
    }

    // Validate password length
    if (body.password.length < 6) {
      return handleError("Password must be at least 6 characters", 400);
    }

    const response = await api(`${BACKEND_URL}/auth/seller/register`, {
      method: "POST",
      body: {
        email: body.email,
        password: body.password,
      },
    });

    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Registration failed",
        response.statusCode
      );
    }

    return Response.json(
      {
        status: "success",
        message: "Registration successful",
        data: response.data || response,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error occurred during seller registration: ${error}`);
    return Response.json(
      { status: "error", message: "Failed to register seller" },
      { status: 500 }
    );
  }
}
