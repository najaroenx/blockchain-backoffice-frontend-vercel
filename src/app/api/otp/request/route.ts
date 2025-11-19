import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/config/firebase-admin";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

export async function POST(request: NextRequest) {
  console.log("Received OTP request");
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Validate phone number
    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { message: "หมายเลขโทรศัพท์ไม่ถูกต้อง" },
        { status: 400 }
      );
    }
    const response = await api(
      `${BACKEND_URL}/cmi5o77hc00079yqzgrtf0e5l/customer/phone/${phoneNumber}`,
      {
        method: "GET",
      }
    );
    console.log("Backend response for phone check:", response);
    // ไม่เจอหมายเลขโทรศัพท์ แสดงว่าสามารภลงทะเบียนใหม่ได้
    if (response.error === "NEW_OTP_GENERATED") {
      return NextResponse.json(
        { message: "สามารถลงทะเบียนใหม่ได้" },
        { status: 200 }
      );
    }

    if (!response || response.statusCode) {
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดจากระบบหลังบ้าน" },
        { status: 500 }
      );
    }
    // Format phone number to international format (+66)
    const formattedPhone = `+66${phoneNumber.substring(1)}`;

    // Note: Firebase Phone Auth sends OTP automatically via SMS
    // This endpoint just validates the phone number format
    // The actual OTP sending is handled by Firebase client SDK

    return NextResponse.json(
      {
        success: false,
        message: "เบอร์โทรศัพท์ได้ถูกลงทะเบียนแล้ว",
        phoneNumber: formattedPhone,
      },
      { status: 400 }
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
    const merchantId = searchParams.get("merchantid");

    const response = await api(`${BACKEND_URL}/templink/${requestId}`, {
      method: "GET",
    });
    if (response) {
      const { uid, phoneNumber, expire } = response;
      if (expire < Date.now()) {
        return NextResponse.json(
          { message: "RequestId has expired" },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Valid RequestId",
            data: { uid, phoneNumber, expire },
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Invalid RequestId" },
        { status: 404 }
      );
    }
    // Add your logic here to handle the GET request using the requestId
    return NextResponse.json(
      {
        message: `GET request received with requestId: ${requestId}`,
        data: { requestId, merchantId },
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
