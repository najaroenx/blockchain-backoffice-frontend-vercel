export async function GET(req: Request) {
  try {
    if (req.method === "GET") {
      return Response.json(
        [
          {
            id: 1,
            name: "AIS Point",
            description: "Point for loyalty program",
          },
        ],
        {
          headers: {
            "X-Total-Count": "1",
            "Access-Control-Expose-Headers": "X-Total-Count",
          },
        }
      );
    }
  } catch (err) {
    Response.json({ error: "failed to load data" }, { status: 500 });
  }
}
