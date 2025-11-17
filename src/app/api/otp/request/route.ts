import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/config/firebase-admin";

export async function POST(request: NextRequest) {
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

    // Format phone number to international format (+66)
    const formattedPhone = `+66${phoneNumber.substring(1)}`;

    // Note: Firebase Phone Auth sends OTP automatically via SMS
    // This endpoint just validates the phone number format
    // The actual OTP sending is handled by Firebase client SDK

    return NextResponse.json({
      success: true,
      message: "กรุณารอรับ OTP ทาง SMS",
      phoneNumber: formattedPhone,
    });
  } catch (error) {
    console.error("Error processing phone number:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการประมวลผล" },
      { status: 500 }
    );
  }
}
