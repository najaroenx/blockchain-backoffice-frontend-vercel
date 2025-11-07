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
    
    // Remove timeMode and calculate frameSize & slotSize
    const { timeMode, startDate, endDate, ...bodyWithoutTimeMode } = body;
    
    let frameSize: number;
    let slotSize: number;
    
    if (timeMode === "calendar" && startDate && endDate) {
      // Calendar mode: calculate based on days between start and end date
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      frameSize = diffDays;
      // วินาทีของวัน = 86400, แล้วหารด้วย 12
      slotSize = Math.floor((diffDays * 86400) / 12);
      
      logger.info(`Calendar mode - Days: ${diffDays}, frameSize: ${frameSize}, slotSize: ${slotSize}`);
    } else {
      // Preset mode: use frameSize from body
      frameSize = body.frameSize || 1;
      // คำนวณวินาทีจากจำนวน quarters (แต่ละ quarter = 3 เดือน)
      // 1 quarter = 3 months ≈ 90 days = 7,776,000 วินาที
      const secondsPerQuarter = 90 * 24 * 60 * 60; // 7,776,000 วินาที
      const totalSeconds = frameSize * secondsPerQuarter;
      slotSize = Math.floor(totalSeconds / 12);
      
      logger.info(`Preset mode - Quarters: ${frameSize}, totalSeconds: ${totalSeconds}, slotSize: ${slotSize}`);
    }
    
    const response = await api(backendUrl, {
      method: "POST",
      body: {
        ...bodyWithoutTimeMode,
        frameSize: slotSize, // ส่งเฉพาะ frameSize ที่มีค่าเป็น slotSize
      },
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
