import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(
    `Received request MARKETER COUPONS: ${req.method} ${req.url}`,
  );

  try {
    const merchantId = params.id;

    if (!merchantId) {
      return handleError("merchantId is required", 400);
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

    const backendUrl = `${BACKEND_URL}/dashboard/marketer/${merchantId}/coupons`;
    logger.info(
      `Fetching marketer coupons for merchantId: ${merchantId} from ${backendUrl}`,
    );

    const response = await api(backendUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(
      {
        message: "success",
        data: response,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error(`Error fetching marketer coupons: ${error}`);
    return Response.json(
      { error: "failed to load marketer coupons" },
      { status: 500 },
    );
  }
}
