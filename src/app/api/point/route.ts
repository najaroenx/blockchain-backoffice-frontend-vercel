import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = session?.user.accessToken;

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const { points, counts } = await api(`${BACKEND_URL}/point/${merchantId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json(points, {
      headers: {
        "X-Total-Count": counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const token = session?.user.accessToken;

  try {
    await api(`${BACKEND_URL}/point`, {
      method: "POST",
      body: {
        ...body,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
