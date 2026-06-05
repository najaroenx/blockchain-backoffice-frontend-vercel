import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

/**
 * POST /api/[id]/marketplace/buy
 * Buy a product from seller
 * Real backend endpoint: /coupon/merchant/buy-from-seller
 */
export async function POST(
  req: NextRequest,
  context: RouteContext<{ id: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: merchantId } = await context.params;
    const body = await req.json();

    // Validate merchantId
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // Validate request body
    const { listingId, amount } = body;
    if (!listingId) {
      return handleError("Listing ID is required", 400);
    }
    if (!amount || amount <= 0) {
      return handleError("Amount must be greater than 0", 400);
    }

    const backendUrl = `${BACKEND_URL}/coupon/merchant/buy-from-seller`;

    logger.info(`Forwarding backend request: POST ${backendUrl}`);
    logger.info(
      `Request body: ${JSON.stringify({ listingId, amount, merchantId })}`
    );

    const response = await api(backendUrl, {
      method: "POST",
      body: {
        listingId: listingId.toString(),
        amount: Number(amount),
        merchantId,
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    logger.info(`Backend response: ${JSON.stringify(response)}`);

    // Handle error response from backend
    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Failed to buy from seller",
        response.statusCode
      );
    }

    // Return success response
    return Response.json({
      status: "success",
      message: "Purchase successful",
      data: response.data || response,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      {
        status: "error",
        message: "Failed to complete purchase",
      },
      { status: 500 }
    );
  }
}
