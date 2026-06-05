import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const name = searchParams.get("name");
    const location = searchParams.get("location");
    const website = searchParams.get("website");
    const hasWallet = searchParams.get("hasWallet");
    const pointId = searchParams.get("pointId");

    // Build query string
    const queryParams = new URLSearchParams({
      page,
      limit,
    });

    if (name) queryParams.append("name", name);
    if (location) queryParams.append("location", location);
    if (website) queryParams.append("website", website);
    if (hasWallet) queryParams.append("hasWallet", hasWallet);
    if (pointId) queryParams.append("pointId", pointId);

    // Forward to backend (public endpoint for coupon creation)
    const response = await fetch(`${BACKEND_URL}/merchant/all?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message: errorData.message || "Failed to fetch merchants",
          error: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching merchants:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}