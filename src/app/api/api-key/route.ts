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

    const response = await fetch(`${BACKEND_URL}/api-key/${merchantId}`, {
      method: "get",
    });

    const { apiKeys, counts } = await response.json();

    return Response.json(apiKeys, {
      headers: {
        "X-Total-Count": counts.toString(),
        "Access-Control-Expose-Headers": "X-Total-Count",
      },
    });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
