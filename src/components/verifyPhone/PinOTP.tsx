"use client";
// import Image from "next/image";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
// import { auth } from "@/app/config/firebase";

const PinOTP = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    phoneNumber,
    token,
    setOtpCode,
    setToken: updateToken,
    merchantId,
  } = useVerifyPhone();

  useEffect(() => {
    let totalSeconds = 120; // 3 minutes

    const timer = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setMin(minutes);
      setSec(seconds);

      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerifyOTP = async () => {
    if (verifyOtp.length !== 6) {
      setError("กรุณาใส่รหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get the confirmation result from context (window object as fallback)
      const confirmationResult = (window as any).confirmationResult;

      if (!confirmationResult) {
        setError("กรุณาขอรหัส OTP ใหม่อีกครั้ง");
        return;
      }

      // Confirm the OTP code with Firebase
      const result = await confirmationResult.confirm(verifyOtp);

      console.log("Firebase OTP Verification Result:", result);

      // User signed in successfully
      // Call backend to verify and create session
      const user = result.user;
      const idToken = await user.getIdToken();

      // Call backend to verify and create session
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          phoneNumber,
          merchantId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการยืนยัน");
      }

      // Save OTP code and token to context
      setOtpCode(verifyOtp);
      if (data.token) {
        updateToken(data.token);
      }

      // Navigate to success step
      onChangeStep(VerifyPhoneStep.SUCCESS);
    } catch (err: any) {
      console.error("Firebase OTP Verification Error:", err);

      // Handle specific Firebase errors
      if (err.code === "auth/invalid-verification-code") {
        setError("รหัส OTP ไม่ถูกต้อง");
      } else if (err.code === "auth/code-expired") {
        setError("รหัส OTP หมดอายุ กรุณาขอรหัสใหม่");
      } else {
        setError(err.message || "เกิดข้อผิดพลาด");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full h-screen flex flex-col items-center p-6 relative">
      {/* Close button */}
      <div className="w-full flex justify-end">
        <button className="w-8 h-8 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600"
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

      {/* Title */}
      <div className="mt-12 text-center px-4">
        <div className="text-2xl text-gray-900 font-bold mb-6">
          ยืนยันรหัส OTP
        </div>
        <div className="text-sm text-gray-600 mb-2">กรุณาใส่รหัส OTP</div>
        <div className="text-sm text-gray-600 mb-3">
          ที่ส่งไปยังหมายเลขโทรศัพท์ {phoneNumber || "0904134444"}
        </div>
        <div className="text-sm text-gray-900 font-semibold">
          รหัสอ้างอิง: TEST001
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 mt-8" id="counter-time">
        <div className="bg-white border-2 border-[#E5E5E5] w-[60px] h-[60px] rounded-lg flex items-center justify-center">
          <span className="text-3xl font-semibold text-gray-900">
            {String(min).padStart(2, "0")}
          </span>
        </div>
        <span className="text-3xl font-semibold text-gray-400">:</span>
        <div className="bg-white border-2 border-[#E5E5E5] w-[60px] h-[60px] rounded-lg flex items-center justify-center">
          <span className="text-3xl font-semibold text-gray-900">
            {String(sec).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* รหัส OTP หมดอายุ text */}
      <div className="mt-3 text-center">
        <div className="text-xs text-gray-500">รหัส OTP หมดอายุ</div>
      </div>

      {/* OTP Dots */}
      <div className="mt-10 w-full px-4">
        <div className="flex flex-rows gap-3 justify-center w-full">
          <OtpInput
            value={verifyOtp}
            onChange={setVerifyOtp}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            renderSeparator={<span className="mx-1" />}
            renderInput={(inputProps, index) => (
              <div className="relative w-4 h-4 flex items-center justify-center">
                <input
                  {...inputProps}
                  className="absolute inset-0 w-4 h-4 text-center text-md font-semibold text-gray-700 bg-transparent border-0 outline-none caret-transparent"
                />
                {!verifyOtp[index] && (
                  <div className="absolute inset-0 bg-[#D9D9D9] w-4 h-4 rounded-full pointer-events-none"></div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 font-semibold text-sm mt-4 text-center px-6">
          {error}
        </div>
      )}

      {/* กรุณากด Request OTP */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-500 mb-2">กรุณากด Request OTP</div>
      </div>

      {/* Request OTP Link */}
      <div className="text-center mb-4">
        <button className="text-blue-500 font-semibold text-base cursor-pointer hover:underline">
          Request OTP
        </button>
      </div>

      {/* เพื่อขอรับรหัสใหม่อีกครั้ง */}
      <div className="text-center">
        <div className="text-sm text-gray-600">เพื่อขอรับรหัสใหม่อีกครั้ง</div>
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-grow"></div>

      {/* Request OTP text */}
      <div className="px-6 text-center mb-5" id="request-otp">
        <div className="text-xs text-gray-600">
          เมื่อคุณได้กด &ldquo;ยืนยันรหัส OTP&rdquo; ถือว่าคุณได้รยอมรับ{" "}
          <span className="text-blue-500 font-semibold cursor-pointer">
            ข้อตกลงการใช้งาน
          </span>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="w-full px-6 pb-6">
        <button
          onClick={handleVerifyOTP}
          disabled={
            loading || verifyOtp.length !== 6 || (min === 0 && sec === 0)
          }
          className={`w-full h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors ${
            loading || verifyOtp.length !== 6 || (min === 0 && sec === 0)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#16C23C] hover:bg-[#14AF37]"
          }`}
        >
          {loading ? "กำลังยืนยัน..." : "ยืนยันรหัส OTP"}
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

export default PinOTP;
