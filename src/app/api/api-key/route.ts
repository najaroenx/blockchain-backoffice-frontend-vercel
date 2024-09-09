const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api-key/cm0qd7fij0006za256h1u7pap`,
      {
        method: "get",
      }
    );

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
