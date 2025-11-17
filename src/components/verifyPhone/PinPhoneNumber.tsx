"use client";
import Image from "next/image";
import { useState } from "react";
import OtpInput from "react-otp-input";
import { VerifyPhoneStep } from "./VerifyPhone";

const PinPhoneNumber = ({
  onChangeStep,
}: {
  onChangeStep: (step: VerifyPhoneStep) => void;
}) => {
  const [otp, setOtp] = useState("");

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
        <button
          onClick={() => {
            onChangeStep(VerifyPhoneStep.PIN_OTP);
          }}
          className="bg-[#16C23C] w-full max-w-[327px] h-[56px] text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          รับรหัส OTP
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
