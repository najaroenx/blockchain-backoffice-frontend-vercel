import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

/**
 * GET /api/[id]/marketplace/seller-listings
 * Fetch all seller listings from the marketplace
 * Real backend endpoint: /coupon/merchant/seller-listings
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;

    // Validate merchantId
    if (!merchantId || !/^[a-zA-Z0-9_-]+$/.test(merchantId)) {
      return handleError("Invalid merchant ID", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    // Parse query parameters for filtering
    const { searchParams } = new URL(req.url);
    const valueType = searchParams.get("valueType");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // Build backend URL with query params
    const backendUrl = new URL(
      `${BACKEND_URL}/coupon/merchant/seller-listings`
    );
    if (valueType) backendUrl.searchParams.set("valueType", valueType);
    if (isActive) backendUrl.searchParams.set("isActive", isActive);
    if (search) backendUrl.searchParams.set("search", search);
    if (page) backendUrl.searchParams.set("page", page);
    if (limit) backendUrl.searchParams.set("limit", limit);

    logger.info(`Forwarding backend request: GET ${backendUrl.toString()}`);

    const response = await api(backendUrl.toString(), {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    logger.info(`Backend response: ${JSON.stringify(response)}`);

    // Handle error response from backend
    if (response.statusCode && response.statusCode >= 400) {
      return handleError(
        response.message || "Failed to fetch listings",
        response.statusCode
      );
    }

    // Return with proper structure
    // Backend might return { status, message, data: { total, listings } }
    // Or directly { listings, total }
    if (response.data) {
      return Response.json(response);
    } else if (response.listings) {
      // If response has listings directly, wrap it
      return Response.json({
        status: "success",
        message: "OK",
        data: {
          total: response.total || response.listings.length,
          listings: response.listings,
        },
      });
    } else {
      // Fallback - assume response itself is the data
      return Response.json({
        status: "success",
        message: "OK",
        data: response,
      });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      {
        status: "error",
        message: "Failed to load seller listings",
        data: { total: 0, listings: [] },
      },
      { status: 500 }
    );
  }
}
