"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
import { useSearchParams } from "next/navigation";

const PinPhoneNumber = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestid"); // Get 'requestid' param
  const merchantIds = searchParams.get("merchantId"); // Get 'merchantid' param

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPhoneNumber, setToken, setMerchantId } = useVerifyPhone();

  useEffect(() => {
    // Fetch data when component renders
    const fetchData = async () => {
      if (requestId) {
        try {
          const response = await fetch(
            `/api/otp/request?requestid=${requestId}&merchantid=${merchantIds}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setMerchantId(merchantIds);
          // const data = await response.json();
          // TODO: if error will going to redirect to another domain
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [merchantIds, requestId, setMerchantId]);

  const handleRequestOTP = async () => {
    // Validate phone number (10 digits, starts with 0)
    if (otp.length !== 10 || !otp.startsWith("0")) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send OTP request to backend API (will integrate with SMS provider)
      const response = await fetch("/api/otp/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: otp, //phone number input
          merchantId: merchantIds,
          requestId: requestId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save phone number and token from SMS provider response
        setPhoneNumber(otp);
        setToken(data.token || data.verificationId); // Token from SMS provider

        // Navigate to OTP verification step
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
          <div className="flex flex-rows gap-3 justify-center w-full">
            <OtpInput
              value={otp}
              onChange={(value) => {
                // Only allow input if first character is 0 or if value is empty
                if (value === "" || value.startsWith("0")) {
                  setOtp(value);
                  setError(null); // Clear error when valid input
                } else {
                  setError("เบอร์โทรศัพท์ต้องเริ่มต้นด้วย 0");
                }
              }}
              numInputs={10}
              inputType="tel"
              shouldAutoFocus
              renderSeparator={<span className="mx-1" />}
              renderInput={(inputProps, index) => (
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <input
                    {...inputProps}
                    className="absolute inset-0 w-4 h-4 text-center text-md font-semibold text-gray-700 bg-transparent border-1 border-gray-300 outline-none caret-transparent"
                  />
                  {!otp[index] && (
                    <div className="absolute inset-0 bg-[#D9D9D9] w-4 h-4 rounded-full pointer-events-none"></div>
                  )}
                </div>
              )}
            />
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
          disabled={loading || otp.length !== 10}
          className={`w-full max-w-[327px] h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 ${
            loading || otp.length !== 10
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
