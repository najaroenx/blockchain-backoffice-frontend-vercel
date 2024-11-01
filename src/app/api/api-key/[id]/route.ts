import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");
    const apiKeyId = params.id;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/api-key/${apiKeyId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.merchantId, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
