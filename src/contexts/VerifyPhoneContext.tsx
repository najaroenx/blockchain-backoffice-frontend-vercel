"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type VerifyPhoneContextValue = string | null;

const VerifyPhoneContext = createContext<VerifyPhoneContextValue>(null);

type VerifyPhoneProviderProps = {
  value: VerifyPhoneContextValue;
  children: ReactNode;
};

export const VerifyPhoneProvider = ({
  value,
  children,
}: VerifyPhoneProviderProps) => (
  <VerifyPhoneContext.Provider value={value}>{children}</VerifyPhoneContext.Provider>
);

export const useVerifyPhone = () => useContext(VerifyPhoneContext);
