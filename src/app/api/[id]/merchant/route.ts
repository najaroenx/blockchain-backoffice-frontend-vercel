import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/options";
import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockMerchants } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    if (!shouldProtectAdmin) {
      const merchantId = params?.id;
      const filteredMerchants = merchantId
        ? mockMerchants.filter((merchant) => merchant.id === merchantId)
        : mockMerchants;
      const data =
        filteredMerchants.length > 0 ? filteredMerchants : mockMerchants;

      return Response.json(data, {
        headers: {
          "X-Total-Count": data.length.toString(),
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    if (shouldProtectAdmin && !token) {
      return handleError("Unauthorized access", 401);
    }
    const response = await api(`${BACKEND_URL}/merchant`, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    console.log("GET /merchant response:", response);
    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.merchants, {
      headers: {
        "X-Total-Count": response.counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    if (!shouldProtectAdmin) {
      return Response.json({ message: "noop (admin auth disabled)" });
    }

    const body = await req.json();
    let token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
    let userId: string | undefined = undefined;

    if (shouldProtectAdmin) {
      const session = await getServerSession(authOptions);
      token = session?.user.accessToken ?? "";
      userId = session?.user.id;

      if (!token) {
        return handleError("Unauthorized access", 401);
      }
    }

    await api(`${BACKEND_URL}/merchant`, {
      method: "POST",
      body: {
        ...body,
        userId,
      },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
