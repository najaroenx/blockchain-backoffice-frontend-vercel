import { api } from "@/libs/api";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockPoints } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;

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

    const backendUrl = `${BACKEND_URL}/${merchantId}/point/`;
    logger.info(`Forwarding backend request: GET ${backendUrl}`);

    const response = await api(backendUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.points, {
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
export async function POST(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  const body = await req.json();

  const merchantId = params.id;


  const token = shouldProtectAdmin ? (await getSessionToken()) ?? "" : "";
  if (shouldProtectAdmin && !token) {
    return handleError("Unauthorized access", 401);
  }

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  try {
    const backendUrl = `${BACKEND_URL}/${merchantId}/point`;
    logger.info(`Forwarding backend request: POST ${backendUrl}`);
    logger.info(`Request body: ${JSON.stringify(body)}`);
    
    // Remove timeMode and prepare request body
    const { timeMode, startDate, endDate, expiryMonths, ...bodyWithoutTimeMode } = body;
    
    let requestBody: any = { ...bodyWithoutTimeMode };
    
    if (timeMode === "calendar" && startDate && endDate) {
      // Calendar mode: Convert ISO date strings to Unix timestamps (seconds)
      requestBody.startDate = Math.floor(new Date(startDate).getTime() / 1000);
      requestBody.endDate = Math.floor(new Date(endDate).getTime() / 1000);
      logger.info(`Calendar mode - Converted dates: startDate=${requestBody.startDate}, endDate=${requestBody.endDate}`);
    } else if (expiryMonths) {
      // Preset mode: Calculate startDate (now) and endDate based on expiryMonths
      const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
      const secondsPerMonth = 30.44 * 24 * 60 * 60; // Average month in seconds
      const expirySeconds = Math.floor(expiryMonths * secondsPerMonth);
      
      requestBody.startDate = now;
      requestBody.endDate = now + expirySeconds;
      logger.info(`Preset mode - Months: ${expiryMonths}, startDate=${requestBody.startDate}, endDate=${requestBody.endDate}`);
    }
    
    logger.info(`Sending to backend - body: ${JSON.stringify(requestBody)}`);
    
    const response = await api(backendUrl, {
      method: "POST",
      body: requestBody,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ id:response.id , name:response.name,symbol:response.symbol,message: "success" }, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
