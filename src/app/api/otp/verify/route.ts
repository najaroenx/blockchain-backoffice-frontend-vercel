import { NextRequest, NextResponse } from "next/server";
import { api } from "@/libs/api";

const BACKEND_URL = process.env.MERCHANT_BACKEND || "http://localhost:4000";

// Types
interface VerifyOTPRequest {
  phoneNumber: string;
  merchantId: string;
  otpCode: string;
}

interface OTPVerifyResponse {
  statusCode: number;
}

// Helper Functions
const generateRandomEmail = (): string => {
  const randomWord = generateRandomString(5);
  return `user${randomWord}@example.com`;
};

const generateRandomString = (length: number = 8): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const checkCustomerExists = async (
  merchantId: string,
  phoneNumber: string
): Promise<boolean> => {
  const customer = await api(
    `${BACKEND_URL}/${merchantId}/customer/phone/${phoneNumber}`,
    { method: "GET" }
  );
  console.log("Customer Exists:", customer);
  if (customer.statusCode === 404) {
    return false;
  }
  return true;
};

const verifyOTPCode = async (
  phoneNumber: string,
  otpCode: string
): Promise<OTPVerifyResponse> => {
  const response = await api(`${BACKEND_URL}/templink/verify-otp`, {
    method: "POST",
    body: { phoneNumber, otpCode },
  });

  console.log("OTP Verification Response:", response);
  return response;
};

const createNewCustomer = async (
  merchantId: string,
  phoneNumber: string
): Promise<void> => {
  const email = generateRandomEmail();

  const response = await api(`${BACKEND_URL}/${merchantId}/customer`, {
    method: "POST",
    body: {
      tel: phoneNumber,
      email,
    },
  });

  console.log("Customer Created:", response);
};

const successResponse = () => {
  return NextResponse.json({
    success: true,
    message: "ยืนยัน OTP สำเร็จ",
  });
};

const errorResponse = (message: string, status: number = 500) => {
  return NextResponse.json({ message }, { status });
};

// Main Handler
export async function POST(request: NextRequest) {
  try {
    const body: VerifyOTPRequest = await request.json();
    const { phoneNumber, merchantId, otpCode } = body;

    // Step 1: Verify OTP code
    const otpVerifyResult = await verifyOTPCode(phoneNumber, otpCode);

    if (otpVerifyResult.statusCode === 400) {
      return errorResponse("รหัส OTP ไม่ถูกต้อง", 400);
    }

    // Step 2: Check if customer exists
    const customerExists = await checkCustomerExists(merchantId, phoneNumber);

    // Step 3: Create customer if not exists
    if (!customerExists) {
      await createNewCustomer(merchantId, phoneNumber);
    }

    // Step 4: Return success
    return successResponse();
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return errorResponse("เกิดข้อผิดพลาดในการยืนยัน OTP");
  }
}
