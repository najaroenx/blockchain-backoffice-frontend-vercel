import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/app/config/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    // Validate input
    if (!idToken) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const phoneNumber = decodedToken.phone_number;

    // Get or create user record
    let userRecord;
    try {
      userRecord = await adminAuth.getUser(uid);
    } catch (error) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลผู้ใช้" },
        { status: 404 }
      );
    }

    // TODO: Save user to your database
    // await createOrUpdateUser({
    //   uid,
    //   phoneNumber,
    //   lastLogin: new Date(),
    // });

    // Create custom token for session management (optional)
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({
      success: true,
      message: "ยืนยัน OTP สำเร็จ",
      token: customToken,
      user: {
        uid,
        phoneNumber,
        displayName: userRecord.displayName,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการยืนยัน OTP" },
      { status: 500 }
    );
  }
}
