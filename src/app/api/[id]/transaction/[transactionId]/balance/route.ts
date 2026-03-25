import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import type { RouteContext } from "@/libs/nextRoute";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(
  req: NextRequest,
  context: RouteContext<{ id: string; transactionId: string }>
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const { id: walletAddress, transactionId } = await context.params;

    if (!walletAddress || !transactionId) {
      return handleError("Missing walletAddress or transactionId", 400);
    }

    const token = (await getSessionToken()) ?? "";
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    logger.info(`Fetching balance for wallet: ${walletAddress}, transaction: ${transactionId}`);

    const response = await api(
      `${BACKEND_URL}/${walletAddress}/transaction/${transactionId}/balance`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(
        response.message ?? "Failed to fetch balance",
        response.statusCode
      );
    }

    logger.info(`Balance fetched successfully for transaction: ${transactionId}`);

    return Response.json(response, {
      status: 200,
      headers: {
        "Access-Control-Expose-Headers": "Content-Type",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json(
      { error: "Failed to fetch transaction balance" },
      { status: 500 }
    );
  }
}
