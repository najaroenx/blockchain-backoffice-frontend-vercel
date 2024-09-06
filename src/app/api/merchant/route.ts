import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/options";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const response = await fetch(`${BACKEND_URL}/merchant/${userId}`, {
      method: "get",
    });

    const { merchants, counts } = await response.json();

    return Response.json(merchants, {
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
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();

    if (!session?.user.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    await fetch(`${BACKEND_URL}/merchant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        userId,
      }),
    });

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
