"use client";
import React from "react";
import { MerchantProvider } from "../contexts/merchantContext";

export default function MerchantPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass null as merchantId since this is the merchant listing page (no specific merchant selected)
  return <MerchantProvider value={null}>{children}</MerchantProvider>;
}
