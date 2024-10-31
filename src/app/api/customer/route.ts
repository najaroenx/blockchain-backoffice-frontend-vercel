import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const start = parseInt(req.nextUrl.searchParams.get("_start") as string);
    const end = parseInt(req.nextUrl.searchParams.get("_end") as string);

    const take = end - start;
    const page = end / take;

    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const response = await api(`${BACKEND_URL}/${merchantId}/customer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      queryParams: {
        take,
        page,
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.customers, {
      headers: {
        "X-Total-Count": response.counts.toString(),
        "Content-Range": `items ${response.lower}-${response.upper}/${response.counts}`,
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
