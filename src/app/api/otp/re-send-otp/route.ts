import { NextRequest, NextResponse } from "next/server";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";
const generateRandomWord = (length: number = 8): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, requestId, merchantId } = body;

    // Validate required fields
    if (!requestId) {
      return NextResponse.json(
        { message: "กรุณาระบุหมายเลขโทรศัพท์และ requestId" },
        { status: 400 }
      );
    }

    console.log("Resending OTP for:", phoneNumber, requestId);

    // Call backend API to resend OTP
    const response = await api(`${BACKEND_URL}/templink/resend-otp`, {
      method: "POST",
      body: {
        requestId,
      },
    });

    console.log("Resend OTP response:", response);

    if (response?.status === "error" || response?.statusCode === 404) {
      return NextResponse.json(
        { message: "เกิดข้อผิดพลาดในการส่ง OTP อีกครั้ง" },
        { status: 400 }
      );
    }
    const email = `user${generateRandomWord(5)}@example.com`;
     await api(
      `${BACKEND_URL}/${merchantId}/customer`,
      {
        method: "POST",
        // headers: {
        //   "x-api-key": process.env.MERCHANT_API_KEY || "bOCiH95dxdFVKdcYnDRl",
        // },
        body: {
          tel: phoneNumber,
          email,
        },
      }
    );

    return NextResponse.json(
      { message: "ส่ง OTP อีกครั้งสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}
