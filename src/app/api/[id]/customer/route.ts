import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockCustomers } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const start = parseInt(req.nextUrl.searchParams.get("_start") ?? "0", 10);
    const end = parseInt(req.nextUrl.searchParams.get("_end") ?? "0", 10);

    const take = Math.max(end - start, 0);
    const page = take === 0 ? 1 : end / take;

    const merchantId = params.id;

    if (!shouldProtectAdmin) {
      const customers = mockCustomers.filter(
        (customer) => !merchantId || customer.merchantId === merchantId
      );
      const total = customers.length;
      const safeEnd = end > 0 ? end : total;
      const data = customers.slice(start, safeEnd);
      const lower = data.length > 0 ? start : 0;
      const upper = data.length > 0 ? start + data.length - 1 : 0;

      return Response.json(data, {
        headers: {
          "X-Total-Count": total.toString(),
          "Content-Range": `items ${lower}-${upper}/${total}`,
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }

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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
