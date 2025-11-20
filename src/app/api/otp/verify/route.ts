import { NextRequest, NextResponse } from "next/server";
// import { adminAuth } from "@/app/config/firebase-admin";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

function generateRandomWord(length: number = 8): string {
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
    const { idToken, phoneNumber, merchantId } = body;

    // Validate input
    if (!idToken) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // // Verify the Firebase ID token
    // const decodedToken = await adminAuth.verifyIdToken(idToken);
    // const uid = decodedToken.uid;
    // const phoneNumber = decodedToken.phone_number;

    // Get or create user record
    // let userRecord;
    // try {
    //   userRecord = await adminAuth.getUser(uid);
    // } catch (error) {
    //   return NextResponse.json(
    //     { message: "ไม่พบข้อมูลผู้ใช้" },
    //     { status: 404 }
    //   );
    // }

    // TODO: Save user to your database
    // await createOrUpdateUser({
    //   uid,
    //   phoneNumber,
    //   lastLogin: new Date(),
    // });

    // Create custom token for session management (optional)
    // const customToken = await adminAuth.createCustomToken(uid);
    const email = `user${generateRandomWord(5)}@example.com`;
    // console.log("Generated email:", email);
    const response = await api(
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
