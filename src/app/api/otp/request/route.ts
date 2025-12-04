import { NextRequest, NextResponse } from "next/server";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, requestId, merchantId } = body;

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { message: "หมายเลขโทรศัพท์ไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    // Check if user with phone number already exists
    const existingUserResponse = await api(
      `${BACKEND_URL}/customer/${phoneNumber}`,
      {
        method: "GET",
      }
    );

    if (
      existingUserResponse &&
      existingUserResponse.status === "success" &&
      existingUserResponse.data
    ) {
      return NextResponse.json(
        { message: "หมายเลขโทรศัพท์นี้มีผู้ใช้แล้ว" },
        { status: 400 }
      );
    }

    console.log("Processing phone number:", phoneNumber, requestId);

    // Send OTP request
    const response = await api(`${BACKEND_URL}/templink/send-otp`, {
      method: "POST",
      body: {
        requestId,
        phoneNumber,
      },
    });

    console.log("OTP request response:", response);

    if (response?.status === "error" || response?.statusCode === 404) {
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดในการส่ง OTP" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "สามารถลงทะเบียนใหม่ได้" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing phone number:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestid");

    if (!requestId) {
      return NextResponse.json(
        { message: "RequestId is required" },
        { status: 400 }
      );
    }

    const response = await api(`${BACKEND_URL}/templink/${requestId}`, {
      method: "GET",
    });

    console.log("GET templink response:", response);

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
