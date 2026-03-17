'use server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";
import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockMerchants } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectPortal =
  (process.env.PORTAL_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest) {
  logger.info(`Received request ${req.method} ${req.url}`);

  try {
    if (!shouldProtectPortal) {
      return Response.json(mockMerchants);
    }

    const token = await getSessionToken();
    console.log("Token:", token);
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
  console.log("📝 POST /api/merchant received");

  try {
    if (!shouldProtectPortal) {
      return Response.json({ message: "noop (portal auth disabled)" });
    }

    const body = await req.json();
    console.log("📝 Body:", body);
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;
    const userId = session?.user.id;
    console.log("new body", {
      ...body,
      userId,
    });
    const response = await api(`${BACKEND_URL}/merchant`, {
      method: "POST",
      body: {
        ...body,
        userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response", response);
    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
