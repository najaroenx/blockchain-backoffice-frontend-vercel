"use client";

import {
  Status,
  useVerifyPhone,
  VerifyPhoneProvider,
} from "@/contexts/VerifyPhoneContext";
import { useSearchParams } from "next/navigation";
import PinPhoneNumber from "./PinPhoneNumber";
import PinOTP from "./PinOTP";
import VerifyPhoneSuccess from "./VerifyPhoneSuccess";
import { useEffect, useState } from "react";
import { Noto_Sans_Thai } from "next/font/google";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export enum VerifyPhoneStep {
  PIN_PHONE_NUMBER,
  PIN_OTP,
  SUCCESS,
}
const VerifyPhoneComponent = () => {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestid");
  const merchantIds = searchParams.get("merchantId");
  const callbackUris = searchParams.get("callbackUri");
  const {
    phoneNumber,
    token,
    otpCode,
    status,
    setStatus,
    setCallbackUri,
    setMerchantId,
  } = useVerifyPhone();

  const [step, setStep] = useState<VerifyPhoneStep>(
    VerifyPhoneStep.PIN_PHONE_NUMBER
  );

  const onChangeStep = (newStep: VerifyPhoneStep) => {
    setStep(newStep);
  };

  useEffect(() => {
    const VerifyRequest = async () => {
      try {
        console.log("Verifying request ID:", requestId, merchantIds);
        const response = await fetch(
          `/api/otp/request?requestid=${requestId}&merchantid=${merchantIds}`
        );
        if (!response.ok) {
          throw new Error("Failed to verify request ID");
        }
        console.log("callbackUris", callbackUris);
        setCallbackUri(callbackUris);
        setMerchantId(merchantIds);
        setStatus(Status.READY);
      } catch (error) {
        setTimeout(() => {
          setStatus(Status.INVALID);
        }, 2000);
        console.error("Error verifying request ID:", error);
      }
    };

    const initializeComponent = async () => {
      if (!requestId) {
        setStatus(Status.INVALID);
        return;
      }
      await VerifyRequest();
    };

    initializeComponent();
  }, [requestId, merchantIds]);

  const renderStep = () => {
    switch (step) {
      case VerifyPhoneStep.PIN_PHONE_NUMBER:
        return <PinPhoneNumber onChangeStep={onChangeStep} />;
      case VerifyPhoneStep.PIN_OTP:
        return <PinOTP onChangeStep={onChangeStep} />;
      case VerifyPhoneStep.SUCCESS:
        return <VerifyPhoneSuccess onChangeStep={onChangeStep} />;
      default:
        return null;
    }
  };
  // Loading State
  if (status === Status.INITIALIZING) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen bg-white ${notoSansThai.className}`}
      >
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-gray-600 font-semibold animate-pulse">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  // Error/Invalid State
  if (status === Status.INVALID) {
    return (
      <div
        className={`flex items-center justify-center h-screen bg-white ${notoSansThai.className}`}
      >
        <div className="text-center text-gray-600 font-semibold">
          หน้านี้ยังไม่พร้อมใช้งาน หรือ ลิงก์หมดอายุ
        </div>
      </div>
    );
  }
  return (
    <VerifyPhoneProvider
      phoneNumber={phoneNumber}
      token={token}
      otpCode={otpCode}
    >
      <div className={notoSansThai.className}>{renderStep()}</div>
    </VerifyPhoneProvider>
  );
};

export default VerifyPhoneComponent;
