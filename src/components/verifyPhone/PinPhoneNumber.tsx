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
  const requestId = searchParams.get("requestid");
  const merchantIds = searchParams.get("merchantId");
  const callbackUris = searchParams.get("callbackUri");

  const [phoneNumber, setPhoneNumberInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidRequestId, setIsValidRequestId] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState(true);

  const { setPhoneNumber, setToken, setMerchantId, setCallbackUri } =
    useVerifyPhone();

  // Initialize component and fetch UID data
  useEffect(() => {
    const initializeComponent = async () => {
      if (!requestId) {
        setIsValidRequestId(false);
        setIsInitializing(false);
        return;
      }

      try {
        const [uidResponse, validationResponse] = await Promise.all([
          fetch(`/api/otp/uid?requestid=${requestId}`),
          fetch(
            `/api/otp/request?requestid=${requestId}&merchantid=${merchantIds}`
          ),
        ]);

        // Handle UID response
        if (uidResponse.ok) {
          const uidData = await uidResponse.json();
          setMerchantId(uidData.merchantId || merchantIds);
          setCallbackUri(uidData.callbackUri || callbackUris || "");
        }

        // Handle validation response
        const isValid = validationResponse.status !== 404;
        setIsValidRequestId(isValid);
      } catch (error) {
        console.error("Error initializing component:", error);
        setIsValidRequestId(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeComponent();
  }, [requestId, merchantIds, callbackUris, setMerchantId, setCallbackUri]);

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

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-600 font-semibold">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  // Show invalid page if requestId is not valid
  if (!isValidRequestId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-600 font-semibold">
          หน้านี้ยังไม่พร้อมใช้งาน
        </div>
      </div>
    );
  }

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
              <OtpInput
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
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
                    {!phoneNumber[index] && (
                      <div className="absolute inset-0 bg-[#D9D9D9] w-4 h-4 rounded-full pointer-events-none"></div>
                    )}
                  </div>
                )}
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
