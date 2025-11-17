"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { VerifyPhoneStep } from "./VerifyPhone";
import { useVerifyPhone } from "@/contexts/VerifyPhoneContext";
import { auth } from "@/app/config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

const PinPhoneNumber = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPhoneNumber, setToken } = useVerifyPhone();
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize RecaptchaVerifier
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved
      },
      'expired-callback': () => {
        setError('reCAPTCHA หมดอายุ กรุณาลองใหม่อีกครั้ง');
      }
    });
    setRecaptchaVerifier(verifier);

    return () => {
      verifier.clear();
    };
  }, []);

  const handleRequestOTP = async () => {
    // Validate phone number (10 digits, starts with 0)
    if (otp.length !== 10 || !otp.startsWith("0")) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ครบ 10 หลัก");
      return;
    }

    if (!recaptchaVerifier) {
      setError("กรุณารอสักครู่...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format phone number to international format (+66)
      const formattedPhone = `66${otp.substring(1)}`;

      // Send OTP via Firebase Phone Auth
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );

      // Save confirmation result and phone number to context
      setConfirmationResult(confirmation);
      (window as any).confirmationResult = confirmation; // Store globally for PinOTP
      setPhoneNumber(otp);
      setToken(confirmation.verificationId); // Store verification ID as token

      // Navigate to OTP verification step
      onChangeStep(VerifyPhoneStep.PIN_OTP);
    } catch (err: any) {
      console.error("Firebase Phone Auth Error:", err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/invalid-phone-number') {
        setError('หมายเลขโทรศัพท์ไม่ถูกต้อง');
      } else if (err.code === 'auth/too-many-requests') {
        setError('มีการร้องขอมากเกินไป กรุณาลองใหม่ภายหลัง');
      } else if (err.code === 'auth/captcha-check-failed') {
        setError('การยืนยัน reCAPTCHA ล้มเหลว กรุณาลองใหม่');
      } else {
        setError(err.message || "เกิดข้อผิดพลาดในการส่ง OTP");
      }
      
      // Reset recaptcha on error
      recaptchaVerifier?.clear();
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
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        <div className="flex flex-rows gap-3 justify-center w-full">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={10}
            inputType="tel"
            shouldAutoFocus
            renderSeparator={<span className="mx-1" />}
            renderInput={(inputProps, index) => (
              <div className="relative w-4 h-4 flex items-center justify-center">
                <input
                  {...inputProps}
                  className="absolute inset-0 w-4 h-4 text-center text-md font-semibold text-gray-700 bg-transparent border-0 outline-none caret-transparent"
                />
                {!otp[index] && (
                  <div className="absolute inset-0 bg-[#D9D9D9] w-4 h-4 rounded-full pointer-events-none"></div>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-6 px-4">
        {/* Recaptcha container */}
        <div id="recaptcha-container"></div>
        
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
