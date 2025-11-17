"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type VerifyPhoneContextValue = {
  phoneNumber: string | null;
  token: string | null;
  otpCode: string | null;
  setPhoneNumber: (phone: string | null) => void;
  setToken: (token: string | null) => void;
  setOtpCode: (otp: string | null) => void;
};

const VerifyPhoneContext = createContext<VerifyPhoneContextValue>({
  phoneNumber: null,
  token: null,
  otpCode: null,
  setPhoneNumber: () => {},
  setToken: () => {},
  setOtpCode: () => {},
});

type VerifyPhoneProviderProps = {
  phoneNumber?: string | null;
  token?: string | null;
  otpCode?: string | null;
  children: ReactNode;
};

export const VerifyPhoneProvider = ({
  phoneNumber: initialPhone = null,
  token: initialToken = null,
  otpCode: initialOtp = null,
  children,
}: VerifyPhoneProviderProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(initialPhone);
  const [token, setToken] = useState<string | null>(initialToken);
  const [otpCode, setOtpCode] = useState<string | null>(initialOtp);

  return (
    <VerifyPhoneContext.Provider
      value={{
        phoneNumber,
        token,
        otpCode,
        setPhoneNumber,
        setToken,
        setOtpCode,
      }}
    >
      {children}
    </VerifyPhoneContext.Provider>
  );
};

export const useVerifyPhone = () => useContext(VerifyPhoneContext);
