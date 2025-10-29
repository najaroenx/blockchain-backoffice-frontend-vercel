"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type MerchantContextValue = string | null;

const MerchantContext = createContext<MerchantContextValue>(null);

type MerchantProviderProps = {
  value: MerchantContextValue;
  children: ReactNode;
};

export const MerchantProvider = ({
  value,
  children,
}: MerchantProviderProps) => (
  <MerchantContext.Provider value={value}>{children}</MerchantContext.Provider>
);

export const useMerchantId = () => useContext(MerchantContext);
