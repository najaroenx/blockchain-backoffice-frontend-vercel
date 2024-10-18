import { handleError } from "@/libs/errorHandler";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const response = await api(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      body: {
        ...body,
      },
    });

    if (response.statusCode) {
      return handleError(response.message, response.statusCode);
    }

    return Response.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
