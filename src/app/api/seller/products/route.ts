import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

/**
 * POST /api/seller/products
 * Create a new product (coupon) as interim seller
 * Real backend endpoint: /coupon/dev/interim-seller/{merchantId}
 */
export async function POST(req: NextRequest) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const body = await req.json();

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // Validate request body
    const { merchantId, coupon } = body;

    if (!merchantId) {
      return handleError("Merchant ID is required", 400);
    }

    if (!coupon) {
      return handleError("Coupon data is required", 400);
    }

    if (!coupon.name) {
      return handleError("Coupon name is required", 400);
    }

    const backendUrl = `${BACKEND_URL}/coupon/dev/interim-seller/${merchantId}`;

    logger.info(`Forwarding backend request: POST ${backendUrl}`);
    logger.info(`Request body: ${JSON.stringify(body)}`);

    const response = await api(backendUrl, {
      method: "POST",
      body: {
        coupon: {
          name: coupon.name,
          description: coupon.description || "",
          status: coupon.status || "upcoming",
          merchantId: coupon.merchantId || null,
          valueType: coupon.valueType || "cash",
          value: Number(coupon.value) || 0,
          pointId: coupon.pointId || null,
          pointsCost: Number(coupon.pointsCost) || 0,
          startDate: coupon.startDate,
          endDate: coupon.endDate,
          totalIssued: Number(coupon.totalIssued) || 1,
          imageUrl: coupon.imageUrl || "",
          merchantRef: coupon.merchantRef || "",
        },
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    logger.info(`Backend response: ${JSON.stringify(response)}`);

    // Handle error response from backend
    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Failed to create product",
        response.statusCode
      );
    }

    // Return success response
    return Response.json({
      status: "success",
      message: "Product created successfully",
      data: response.data || response,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      {
        status: "error",
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seller/products?merchantId=xxx
 * Get seller's products
 * Real backend endpoint: /coupon/dev/interim-seller/{merchantId}
 */
export async function GET(req: NextRequest) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const merchantId = searchParams.get("merchantId");

    if (!merchantId) {
      return handleError("Merchant ID is required", 400);
    }

    const backendUrl = `${BACKEND_URL}/coupon/dev/interim-seller/${merchantId}`;

    logger.info(`Forwarding backend request: GET ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    logger.info(`Backend response: ${JSON.stringify(response)}`);

    // Handle error response from backend
    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Failed to fetch products",
        response.statusCode
      );
    }

    // Return success response
    return Response.json({
      status: "success",
      message: "Products fetched successfully",
      data: response.data || response,
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      {
        status: "error",
        message: "Failed to fetch products",
        data: [],
      },
      { status: 500 }
    );
  }
}
