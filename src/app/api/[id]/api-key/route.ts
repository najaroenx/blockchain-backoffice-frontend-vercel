import { api } from "@/libs/api";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/options";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import { NextRequest } from "next/server";
import logger from "@/libs/logger";
import { mockApiKeys } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4004";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request API KEY: ${req.method} ${req.url}`);

  try {
    const start = parseInt(req.nextUrl.searchParams.get("_start") ?? "0", 10);
    const end = parseInt(req.nextUrl.searchParams.get("_end") ?? "0", 10);

    const take = Math.max(end - start, 0);
    const page = take === 0 ? 1 : end / take;

    const merchantId = params.id;

    if (!shouldProtectAdmin) {
      const apiKeys = mockApiKeys.filter(
        (apiKey) => !merchantId || apiKey.merchantId === merchantId
      );
      const total = apiKeys.length;
      const safeEnd = end > 0 ? end : total;
      const data = apiKeys.slice(start, safeEnd);
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
    console.log("merchantId", merchantId);
    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }
    console.log("queryParams", {
      take,
      page,
    });
    const response = await api(`${BACKEND_URL}/${merchantId}/api-key/`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      queryParams: {
        take: 100, //TODO: to fix later
        page,
      },
    });
    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.apiKeys, {
      headers: {
        "X-Total-Count": response.counts.toString(),
        "Content-Range": `items ${response.lower}-${response.upper}/${response.counts}`,
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    if (!shouldProtectAdmin) {
      return Response.json({ message: "admin auth disabled" }, { status: 200 });
    }

    const body = await req.json();
    const merchantId = params.id;

    let token: any = "";
    if (shouldProtectAdmin) {
      const session = await getServerSession(authOptions);
      token = session?.user.accessToken ?? "";
      if (!token) {
        return handleError("Unauthorized access", 401);
      }
    }

    if (!merchantId) {
      return Response.json({ error: "Bad Request" }, { status: 400 });
    }

    await api(`${BACKEND_URL}/${merchantId}/api-key`, {
      method: "POST",
      body: {
        ...body,
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
