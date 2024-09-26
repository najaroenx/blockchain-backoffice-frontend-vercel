import { api } from "@/libs/api";
import { NextRequest } from "next/server";
import { getSessionToken } from "@/libs/auth";
import { handleError } from "@/libs/errorHandler";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");
    const pointId = params.id;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
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
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const body = await req.json();

    const token = await getSessionToken();
    if (!token) {
      return handleError("Unauthorized access", 401);
    }

    const merchantId = req.headers.get("Merchant-Id");
    const pointId = params.id;

    if (!merchantId) {
      return Response.json({ message: "bad request" }, { status: 400 });
    }

    const response = await api(
      `${BACKEND_URL}/${merchantId}/point/${pointId}`,
      {
        method: "PUT",
        body: {
          ...body,
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
  } catch (err) {
    console.log(err);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: any }) {
  const body = await req.json();

  const token = await getSessionToken();
  if (!token) {
    return handleError("Unauthorized access", 401);
  }

  const merchantId = req.headers.get("Merchant-Id");

  const pointId = params.id;

  if (!merchantId) {
    return Response.json({ message: "bad request" }, { status: 400 });
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
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
