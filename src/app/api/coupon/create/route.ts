import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const { sellerWalletAddress, price, coupon } = body;

    if (!sellerWalletAddress || typeof sellerWalletAddress !== "string") {
      return NextResponse.json(
        { message: "sellerWalletAddress is required" },
        { status: 400 }
      );
    }

    if (!price || typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { message: "price must be a positive number" },
        { status: 400 }
      );
    }

    if (!coupon || typeof coupon !== "object") {
      return NextResponse.json(
        { message: "coupon object is required" },
        { status: 400 }
      );
    }

    // Validate coupon fields
    const {
      name,
      description,
      status,
      merchantId,
      valueType,
      value,
      pointId,
      pointsCost,
      startDate,
      endDate,
      totalIssued,
      imageUrl,
    } = coupon;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "coupon.name is required" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "coupon.description is required" },
        { status: 400 }
      );
    }

    if (!merchantId || typeof merchantId !== "string") {
      return NextResponse.json(
        { message: "coupon.merchantId is required" },
        { status: 400 }
      );
    }

    if (!pointId || typeof pointId !== "string") {
      return NextResponse.json(
        { message: "coupon.pointId is required" },
        { status: 400 }
      );
    }

    if (!["cash", "percentage", "gift", "multiplier", "aispoint"].includes(valueType)) {
      return NextResponse.json(
        { message: "coupon.valueType must be cash, percentage, gift, multiplier, or aispoint" },
        { status: 400 }
      );
    }

    if (typeof value !== "number" || value <= 0) {
      return NextResponse.json(
        { message: "coupon.value must be a positive number" },
        { status: 400 }
      );
    }

    if (typeof totalIssued !== "number" || totalIssued <= 0) {
      return NextResponse.json(
        { message: "coupon.totalIssued must be a positive number" },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { message: "coupon.startDate and coupon.endDate are required" },
        { status: 400 }
      );
    }

    // Ensure status is "upcoming"
    if (status !== "upcoming") {
      return NextResponse.json(
        { message: 'coupon.status must be "upcoming"' },
        { status: 400 }
      );
    }

    // merchantRef is optional, so no validation needed
    // but ensure it's a string if provided
    const { merchantRef } = coupon;
    if (merchantRef !== undefined && typeof merchantRef !== "string") {
      return NextResponse.json(
        { message: "coupon.merchantRef must be a string if provided" },
        { status: 400 }
      );
    }

    // Forward to backend (no auth required)
    const response = await fetch(`${BACKEND_URL}/coupon/dev/interim-seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          message: errorData.message || "Failed to create coupon",
          error: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
