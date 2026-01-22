import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

/**
 * POST /api/seller/list-batch-to-marketplace?merchantId=xxx
 * List multiple products to marketplace in batch
 * Real backend endpoint: POST /coupon/seller/batch-list/{merchantId}
 */
export async function POST(req: NextRequest) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    // Get merchantId from query params
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get("merchantId");

    if (!merchantId) {
      return handleError("Merchant ID is required", 400);
    }

    // Validate merchantId format
    if (!/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID format", 400);
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return handleError("Name is required", 400);
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return handleError("Items array is required and must not be empty", 400);
    }

    // Validate each item
    for (const item of body.items) {
      if (!item.voucherId) {
        return handleError("Each item must have a voucherId", 400);
      }
      if (typeof item.amount !== "number" || item.amount <= 0) {
        return handleError("Each item must have a valid amount", 400);
      }
      if (typeof item.pricePerUnitTHB !== "number" || item.pricePerUnitTHB < 0) {
        return handleError("Each item must have a valid pricePerUnitTHB", 400);
      }
    }

    const backendUrl = `${BACKEND_URL}/coupon/seller/batch-list/${merchantId}`;
    logger.info(`Forwarding backend request: POST ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "POST",
      body: {
        name: body.name,
        description: body.description || "",
        items: body.items,
      },
    });

    logger.info(`Backend response: ${JSON.stringify(response)}`);

    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Failed to list products",
        response.statusCode
      );
    }

    return Response.json(
      {
        status: "success",
        message: "Products listed successfully",
        data: response.data || response,
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { status: "error", message: "Failed to list products to marketplace" },
      { status: 500 }
    );
  }
}
