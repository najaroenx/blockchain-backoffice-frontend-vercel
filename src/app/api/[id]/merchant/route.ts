import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/options";
import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }
    const response = await api(`${BACKEND_URL}/merchant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;
    const userId = session?.user.id;

    await api(`${BACKEND_URL}/merchant`, {
      method: "POST",
      body: {
        ...body,
        userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
