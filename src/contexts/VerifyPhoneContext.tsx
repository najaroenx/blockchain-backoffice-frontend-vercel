"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type VerifyPhoneContextValue = {
  merchantId?: string | null;  
  phoneNumber: string | null;
  token: string | null;
  otpCode: string | null;
  setPhoneNumber: (phone: string | null) => void;
  setToken: (token: string | null) => void;
  setOtpCode: (otp: string | null) => void;
  setMerchantId: (merchantId: string | null) => void;
  callbackUri?: string | null;
  setCallbackUri: (callbackUri: string | null) => void;
};

const VerifyPhoneContext = createContext<VerifyPhoneContextValue>({
  phoneNumber: null,
  token: null,
  otpCode: null,
  merchantId: null,
  setPhoneNumber: () => {},
  setToken: () => {},
  setOtpCode: () => {},
  setMerchantId: () => {},
  callbackUri: null,
  setCallbackUri: () => {},
});

type VerifyPhoneProviderProps = {
  phoneNumber?: string | null;
  token?: string | null;
  otpCode?: string | null;
  callbackUri?: string | null;
  children: ReactNode;
};

export const VerifyPhoneProvider = ({
  phoneNumber: initialPhone = null,
  token: initialToken = null,
  otpCode: initialOtp = null,
  callbackUri: initialCallbackUri = null,
  children,
}: VerifyPhoneProviderProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(initialPhone);
  const [token, setToken] = useState<string | null>(initialToken);
  const [otpCode, setOtpCode] = useState<string | null>(initialOtp);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [callbackUri, setCallbackUri] = useState<string | null>(initialCallbackUri);
  return (
    <VerifyPhoneContext.Provider
      value={{
        phoneNumber,
        token,
        otpCode,
        setPhoneNumber,
        setToken,
        setOtpCode,
        merchantId,
        setMerchantId,
        callbackUri,
        setCallbackUri,
        }}
    >
      {children}
    </VerifyPhoneContext.Provider>
  );
};

export const useVerifyPhone = () => useContext(VerifyPhoneContext);
