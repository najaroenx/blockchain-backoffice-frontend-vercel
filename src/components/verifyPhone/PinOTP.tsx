"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { VerifyPhoneStep } from "./VerifyPhone";
const PinOTP = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);
  const [verifyOtp, setVerifyOtp] = useState("");

  useEffect(() => {
    let totalSeconds = 180; // 3 minutes

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

      {/* Title */}
      <div className="mt-8 text-center">
        <div className="text-2xl text-gray-900 font-semibold mb-4">
          ยืนยันรหัส OTP
        </div>
        <div className="text-sm text-gray-500 mb-1">กรุณาใส่รหัส OTP</div>
        <div className="text-sm text-gray-500 mb-4">
          ที่ส่งไปยังหมายเลขโทรศัพท์ 0904134444
        </div>
        <div className="text-sm text-gray-900 font-semibold">
          รหัสอ้างอิง: TEST001
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 mt-6" id="counter-time">
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

      {/* OTP Dots */}
      <div className="mt-8">
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

      {/* Request OTP text */}
      <div className="mt-8 px-6 text-center">
        <div className="text-sm text-gray-500">
          กรณียังไม่ได้รับ SMS OPT ให้กด{" "}
          <span className="text-blue-500 font-semibold cursor-pointer">
            Request OTP
          </span>{" "}
          เพื่อขอรับรหัสใหม่อีกครั้ง
        </div>
      </div>

      {/* Terms text */}
      <div className="mt-6 px-6 text-center">
        <div className="text-xs text-gray-500">
          เมื่อคุณได้กด &ldquo;ยืนยันรหัส OTP&rdquo;
        </div>
        <div className="text-xs text-gray-500">
          ถือว่าคุณได้รยอมรับ{" "}
          <span className="text-blue-500 font-semibold cursor-pointer">
            ข้อตกลงการใช้งาน
          </span>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-6 px-4">
        <button
          onClick={() => {
            onChangeStep(VerifyPhoneStep.SUCCESS);
          }}
          className="bg-[#16C23C] w-full max-w-[327px] h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          ยืนยันรหัส OTP
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
