"use client";
import React from "react";
import { useSellerId } from "@/app/dlt/contexts/sellerContext";
import MarketerDashboard from "@/app/dlt/components/MarketerDashboard";

export default function SellerDashboardPage() {
  const sellerId = useSellerId();

  return (
    <div>
      {sellerId ? (
        <MarketerDashboard merchantId={sellerId} />
      ) : (
        <div className="text-white">Loading...</div>
      )}
    </div>
  );
}
