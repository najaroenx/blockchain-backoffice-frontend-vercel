import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const { apiKeys, counts } = await api(
      `${BACKEND_URL}/api-key/${merchantId}`,
      {
        method: "GET",
      }
    );

    return Response.json(apiKeys, {
      headers: {
        "X-Total-Count": counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    return Response.json({ error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json({ error: "Bad Request" }, { status: 400 });
    }

    await api(`${BACKEND_URL}/api-key/${merchantId}`, {
      method: "POST",
      body: {
        ...body,
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
