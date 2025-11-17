"use client";

import {
  useVerifyPhone,
  VerifyPhoneProvider,
} from "@/contexts/VerifyPhoneContext";
import Image from "next/image";
import PinPhoneNumber from "./PinPhoneNumber";
import PinOTP from "./PinOTP";
import VerifyPhoneSuccess from "./VerifyPhoneSuccess";
import { useState } from "react";

export enum VerifyPhoneStep {
  PIN_PHONE_NUMBER,
  PIN_OTP,
  SUCCESS,
}
const VerifyPhoneComponent = () => {
  const phone = useVerifyPhone();

  const [step, setStep] = useState<VerifyPhoneStep>(
    VerifyPhoneStep.PIN_PHONE_NUMBER
  );

  const onChangeStep = (newStep: VerifyPhoneStep) => {
    setStep(newStep);
  };

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

  return (
    <VerifyPhoneProvider value={phone}>
      <div className="">{renderStep()}</div>
    </VerifyPhoneProvider>
  );
};

export default VerifyPhoneComponent;
