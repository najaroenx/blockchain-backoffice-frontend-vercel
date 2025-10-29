"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import OtpInput from "react-otp-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../config/firebase";
const OTPComponent = () => {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const confirmationRef = useRef<
    import("firebase/auth").ConfirmationResult | null
  >(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );

      recaptchaRef.current.render().catch(console.error);
    }

    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };
  }, []);

  const sendOtp = async () => {
    console.log("Sending OTP to ", recaptchaRef.current);
    if (!recaptchaRef.current) return;
    const conf = await signInWithPhoneNumber(auth, phone, recaptchaRef.current);
    console.log(conf);
    confirmationRef.current = conf;
    setStep("otp");
  };
   const verifyOtp = async () => {
    if (!confirmationRef.current) return;
    const cred = await confirmationRef.current.confirm(otp);
    const idToken = await cred.user.getIdToken();
    console.log({ idToken });
    // Exchange for a secure session cookie
    // const r = await fetch("/api/session/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ idToken }),
    // });
    // if (!r.ok) {
    //   console.error(await r.text());
    //   return;
    // }
  };
  return (
    <div className="md:bg-red-0 h-screen w-full flex flex-col items-center justify-center gap-4">
      <Image
        src={"/images/phone-request.png"}
        alt="Merchant Logo"
        width={200}
        height={100}
        className="object-cover"
      />
      {step === "otp" ? (
        <>
          <div className="font-semibold text-2xl">OTP Verification</div>
          <p className="px-8 text-center">
            {`We have sent the OTP to your mobile number ${phone}`}
          </p>
          <OtpInput
            containerStyle={""}
            inputStyle={
              "w-[40px] h-[50px] rounded shadow-sm border border-gray-200"
            }
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<div className="mx-1" />}
            renderInput={(props) => <input {...props} />}
          />
          <p>{`Didn't you receive the OTP ?`} Resend OTP</p>
          <button onClick={verifyOtp} className="bg-blue-500 text-white px-8 py-2 rounded shadow-sm font-semibold">
            Verify
          </button>
        </>
      ) : (
        <div className="recaptcha-container">
          <div className="font-semibold text-2xl">OTP Verification</div>
          <p className="px-8 text-center">
            We will send you one-time password to you mobile number
          </p>
          <p>Enter Mobile number</p>
          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            maxLength={20}
            className="h-[50px] w-[70%] border-b-2 border-blue-600 px-4 text-xl hover:none"
          />
          <button
            className="bg-blue-500 text-white px-8 py-2 font-semibold rounded shadow-sm"
            onClick={sendOtp}
          >
            GET OTP
          </button>
        </div>
      )}
      <div id="recaptcha-container" />
    </div>
  );
};

export default OTPComponent;
