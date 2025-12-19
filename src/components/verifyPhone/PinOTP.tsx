"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
import InputOTP from "./InputOTP";
import { useSearchParams } from "next/navigation";
import { Noto_Sans_Thai } from "next/font/google";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    min: String(m).padStart(2, "0"),
    sec: String(s).padStart(2, "0"),
  };
};

const TermsModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={`relative z-50 ${notoSansThai.className}`}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200"
      />
      <div className="fixed inset-0 flex items-center justify-center py-[15px] px-4">
        <DialogPanel
          transition
          className="w-full max-w-md h-[calc(100vh-30px)] rounded-2xl bg-white shadow-xl flex flex-col transition-all data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {/* Close Button */}
          <div className="flex justify-end pt-4 pr-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
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

          <div className="px-6 pb-6 flex-1 flex flex-col overflow-hidden">
            <DialogTitle className="text-xl font-bold text-gray-900 mb-4 text-center flex-shrink-0">
              ข้อตกลงการใช้งาน
            </DialogTitle>
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 scrollbar-thin">
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-bold text-gray-900">
                  ข้อตกลงการยืนยันตัวตนด้วยรหัส OTP
                </h3>
                <p className="text-sm text-gray-600">
                  เพื่อความปลอดภัยในการสร้างกระเป๋าเงินและยืนยันตัวตนของคุณ
                </p>
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-gray-900">
                    1. การใช้หมายเลขโทรศัพท์ของคุณ
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                    <li>
                      คุณยืนยันว่าหมายเลขโทรศัพท์ที่กรอกเป็นเบอร์ที่คุณใช้งานจริง
                    </li>
                    <li>
                      คุณยินยอมให้เราใช้หมายเลขโทรศัพท์นี้เพื่อยืนยันตัวตน
                    </li>
                  </ul>
                  <h4 className="text-base font-bold text-gray-900">
                    2. ความปลอดภัย
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
                    <li>ห้ามบอกรหัส OTP ให้ผู้อื่นเด็ดขาด</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const PinOTP = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  // Constants
  const OTP_TIMEOUT_SECONDS = 120; // 2 minutes

  // Hooks & Context
  const {
    phoneNumber,
    token,
    setOtpCode,
    setToken: updateToken,
    merchantId,
  } = useVerifyPhone();
  // Parameters
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestid");
  const merchantIds = searchParams.get("merchantId");

  // Component

  // State
  const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT_SECONDS);
  const [verifyOtp, setVerifyOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Derived State
  const isExpired = timeLeft === 0;
  const { min, sec } = formatTime(timeLeft);
  const canSubmit =
    verifyOtp.length === 6 && !loading && !isExpired && !isVerificationSuccess;

  // Timer Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Handlers
  const handleVerifyOTP = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Verifying OTP...", {
        phoneNumber,
        verifyOtp,
        token,
        merchantId,
      });
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          otpCode: verifyOtp,
          token,
          merchantId: merchantId || merchantIds,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error");

      setOtpCode(verifyOtp);
      if (data.token) updateToken(data.token);
      setIsVerificationSuccess(true);
      setTimeout(() => onChangeStep(VerifyPhoneStep.SUCCESS), 2000);
    } catch (err: any) {
      setError(err.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = useCallback(async () => {
    setTimeLeft(OTP_TIMEOUT_SECONDS);
    setVerifyOtp("");
    setError(null);
    setIsVerificationSuccess(false);

    try {
      console.log("Resending OTP for:", phoneNumber, requestId);
      const response = await fetch("/api/otp/re-send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          requestId,
          merchantId: merchantIds,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      console.log("OTP resent successfully");
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการส่ง OTP อีกครั้ง");
    }
  }, [phoneNumber, requestId]);

  return (
    <>
      <div
        className={`bg-white w-full h-full min-h-screen flex flex-col items-center p-6 relative ${notoSansThai.className}`}
      >
        {/* Header / Close Button */}
        <div className="w-full flex justify-end">
          <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
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

        {/* Title Section */}
        <div className="mt-8 text-center px-4">
          <h1 className="text-2xl text-gray-900 font-bold mb-6">
            ยืนยันรหัส OTP
          </h1>
          <p className="text-sm text-gray-600 mb-2">กรุณาใส่รหัส OTP</p>
          <p className="text-sm text-gray-600 mb-3">
            ที่ส่งไปยังหมายเลขโทรศัพท์ {phoneNumber}
          </p>
          <p className="hidden text-sm text-gray-900 font-semibold">
            รหัสอ้างอิง: TEST001
          </p>
        </div>

        {/* Timer UI */}
        <div className="flex items-center gap-2 mt-8">
          <TimeBox value={min} />
          <span className="text-3xl font-semibold text-gray-400 pb-1">:</span>
          <TimeBox value={sec} />
        </div>

        {/* Expiration Text */}
        <div className="mt-3 text-center h-5">
          {isExpired && (
            <span className="text-xs text-red-500 animate-pulse">
              รหัส OTP หมดอายุ
            </span>
          )}
        </div>

        {/* OTP Input (Custom) */}
        <div className="mt-8 w-full px-4">
          <InputOTP value={verifyOtp} onChange={setVerifyOtp} length={6} />
        </div>

        {/* Error Feedback */}
        <div className="h-10 mt-4 text-center px-6">
          {error && (
            <p className="text-red-500 font-semibold text-sm">{error}</p>
          )}
        </div>

        {/* Resend Section */}
        <div className="mt-2 text-center space-y-2">
          <p className="text-sm text-gray-500">
            {isExpired ? "กรุณากดเพื่อขอรหัสใหม่" : "หากไม่ได้รับรหัส?"}
          </p>
          <button
            onClick={handleResendOTP}
            disabled={!isExpired && timeLeft > 0}
            className={`text-base font-semibold transition-colors ${
              isExpired
                ? "text-blue-500 hover:text-blue-600 cursor-pointer hover:underline"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            ขอรหัส OTP ใหม่
          </button>
        </div>

        <div className="flex-grow" />

        {/* Terms Link */}
        <div className="px-6 text-center mb-5">
          <p className="text-xs text-gray-600">
            เมื่อคุณได้กด &ldquo;ยืนยันรหัส OTP&rdquo; ถือว่าคุณได้ยอมรับ{" "}
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-blue-500 font-semibold cursor-pointer hover:underline inline-block"
            >
              ข้อตกลงการใช้งาน
            </button>
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full px-6 pb-6">
          <button
            onClick={handleVerifyOTP}
            disabled={!canSubmit}
            className={`w-full h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              !canSubmit
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#16C23C] hover:bg-[#14AF37] shadow-lg hover:shadow-xl active:scale-[0.98]"
            }`}
          >
            {loading ? "กำลังตรวจสอบ..." : "ยืนยันรหัส OTP"}
            {!loading && (
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
            )}
          </button>
        </div>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
};

// Helper UI Component
const TimeBox = ({ value }: { value: string }) => (
  <div className="bg-white border-2 border-[#E5E5E5] w-[60px] h-[60px] rounded-lg flex items-center justify-center shadow-sm">
    <span className="text-3xl font-semibold text-gray-900">{value}</span>
  </div>
);
export default PinOTP;
