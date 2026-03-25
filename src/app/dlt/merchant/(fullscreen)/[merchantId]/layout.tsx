"use client";

import React from "react";
import { MerchantProvider } from "@/app/dlt/contexts/merchantContext";
import { SelectedProductProvider } from "@/app/dlt/contexts/selectedProductContext";

export default function FullscreenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = React.use(params);

  return (
    <MerchantProvider value={merchantId}>
      <SelectedProductProvider>
        <div className="min-h-screen bg-white">{children}</div>
      </SelectedProductProvider>
    </MerchantProvider>
  );
}
