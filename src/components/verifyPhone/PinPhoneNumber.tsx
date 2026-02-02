"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
import { useSearchParams } from "next/navigation";
import InputOTP from "./InputOTP";

const PinPhoneNumber = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestid");
  const merchantIds = searchParams.get("merchantId");

  const [phoneNumber, setPhoneNumberInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setPhoneNumber, setToken } = useVerifyPhone();

  const handlePhoneNumberChange = (value: string) => {
    if (value === "" || value.startsWith("0")) {
      setPhoneNumberInput(value);
      setError(null);
    } else {
      setError("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0");
    }
  };

  const handleRequestOTP = async () => {
    if (phoneNumber.length !== 10 || !phoneNumber.startsWith("0")) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          merchantId: merchantIds,
          requestId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhoneNumber(phoneNumber);
        setToken(data.token || data.verificationId);
        onChangeStep(VerifyPhoneStep.PIN_OTP);
      } else {
        setError(data.message || "เกิดข้อผิดพลาดในการร้องขอ OTP");
      }
    } catch (err: any) {
      console.error("OTP Request Error:", err);
      setError(err.message || "เกิดข้อผิดพลาดในการส่ง OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center p-4 relative">
      {/* Close button */}
      <div className="w-full flex justify-end mt-2">
        <button className="w-6 h-6 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="relative w-[180px] h-[180px] mt-8">
        <Image
          src="/images/fill-phone-number.png"
          alt="Example image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Title and Input */}

      <div className="mt-12 flex flex-col items-center gap-6">
        <div className="text-lg text-gray-900 font-semibold text-center">
          ใส่หมายเลขโทรศัพท์ของคุณ
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <div className="flex flex-rows gap-3 justify-center w-full items-center">
            <InputOTP
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              length={10}
              autoFocus={true}
            />
            {/* Green checkmark when phone number is complete */}
            {phoneNumber.length === 10 && phoneNumber.startsWith("0") && (
              <svg
                className="w-6 h-6 text-green-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm font-semibold text-center">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-6 px-4">
        <button
          onClick={handleRequestOTP}
          disabled={loading || phoneNumber.length !== 10}
          className={`w-full max-w-[327px] h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 ${
            loading || phoneNumber.length !== 10
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#16C23C]"
          }`}
        >
          {loading ? "กำลังส่ง..." : "รับรหัส OTP"}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PinPhoneNumber;
