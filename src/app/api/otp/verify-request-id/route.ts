import { NextRequest, NextResponse } from "next/server";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestid");
    console.log("Processing GET request with requestId:", requestId);

    if (!requestId) {
      return NextResponse.json(
        { message: "RequestId is required" },
        { status: 400 }
      );
    }

    const response = await api(`${BACKEND_URL}/templink/${requestId}`, {
      method: "GET",
    });

    console.log("GET URL response:", response);

    if (!response || response.status !== "success" || !response.data) {
      return NextResponse.json(
        { message: "Invalid RequestId" },
        { status: 404 }
      );
    }

    const { uid, phoneNumber, expire, merchantId } = response.data;

    // Check if expired (expire is ISO string, convert to timestamp)
    const expireTime = new Date(expire).getTime();
    if (expireTime < Date.now()) {
      console.log("RequestId has expired");
      return NextResponse.json(
        { message: "RequestId has expired" },
        { status: 400 }
      );
    }

     return NextResponse.json(
      {
        message: "RequestId is valid",
        uid,
        phoneNumber,
        merchantId,
        expire,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}
