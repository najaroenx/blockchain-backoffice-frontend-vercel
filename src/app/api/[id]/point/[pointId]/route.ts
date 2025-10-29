import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";
import logger from "@/libs/logger";
import { mockPoints } from "@/data/mockAdmin";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const shouldProtectAdmin =
  (process.env.ADMIN_REQUIRE_AUTH ?? "true").toLowerCase() !== "false";

export async function GET(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;
    const pointId = params.pointId;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    if (!shouldProtectAdmin) {
      const point = mockPoints.find(
        (item) =>
          item.id === pointId && (!merchantId || item.merchantId === merchantId)
      );
      return Response.json(point ?? null, { status: 200 });
    }

    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/point/${pointId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.point, { status: 200 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;
    const pointId = params.pointId;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    const body = await req.json();
    if (!shouldProtectAdmin) {
      const existing = mockPoints.find(
        (item) =>
          item.id === pointId && (!merchantId || item.merchantId === merchantId)
      );
      const updated = existing
        ? { ...existing, ...body }
        : { id: pointId, merchantId, ...body };
      return Response.json(updated, { status: 200 });
    }

    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/point/${pointId}`,
      {
        method: "PUT",
        body: {
          frameSize: body.frameSize,
          slotSize: body.slotSize,
          contractAddress: body.contractAddress,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json(response.point, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  const body = await req.json();

  const merchantId = params.id;
  const pointId = params.pointId;

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
  }

  if (!shouldProtectAdmin) {
    return Response.json({ message: "success" }, { status: 201 });
  }

  const token = await getSessionToken();
  if (!token) {
    return handleError("Unauthorized access", 401);
  }

  try {
    const response = await api(
      `${BACKEND_URL}/${merchantId}/transaction/${pointId}`,
      {
        method: "POST",
        body: {
          ...body,
          senderAddress: "0x32D5a21376C0dF3F98200a00380b06adeE341B91", // TODO: remove hard code wallet address
          transactionTypeId: "redeem",
          amount: parseInt(body.amount),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }
    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  logger.info(`Received request: ${req.method} ${req.url}`);

  try {
    const merchantId = params.id;
    const pointId = params.pointId;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    if (!shouldProtectAdmin) {
      return Response.json(pointId, { status: 201 });
    }

    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/point/${pointId}`,
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

    return Response.json(response.id, { status: 201 });
  } catch (error) {
    logger.error(`Error occurred: ${error}`);

    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
