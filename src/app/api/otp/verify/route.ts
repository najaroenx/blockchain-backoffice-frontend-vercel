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
    const { phoneNumber, merchantId, otpCode } = body;


    // Verify OTP with backend SMS provider
     const responseVerify = await api(
      `${BACKEND_URL}/templink/verify-otp`,
      {
        method: "POST",
        // headers: {
        //   "x-api-key": process.env.MERCHANT_API_KEY || "bOCiH95dxdFVKdcYnDRl",
        // },
        body: {
          phoneNumber: phoneNumber,
          otpCode: otpCode,
        },
      }
    )
    console.log("OTP Verification Response:", responseVerify);
    if (responseVerify.statusCode === 400) {
      return NextResponse.json(
        { message: "รหัส OTP ไม่ถูกต้อง" },
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

    return NextResponse.json({
      success: true,
      message: "ยืนยัน OTP สำเร็จ",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยืนยัน OTP" },
      { status: 500 }
    );
  }
}
