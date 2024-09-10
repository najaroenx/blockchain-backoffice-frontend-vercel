import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const userId = session.user.id as string;

    const merchantId = req.headers.get("Merchant-Id");

    if (!merchantId) {
      return Response.json([], {
        headers: {
          "X-Total-Count": "0",
          "Access-Control-Expose-Headers": "X-Total-Count",
        },
      });
    }

    const response = await fetch(`${BACKEND_URL}/point/${merchantId}`, {
      method: "get",
    });

    const { points, counts } = await response.json();

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

  try {
    // TODO: authorize user before create point

    await fetch(`${BACKEND_URL}/point`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
      }),
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
