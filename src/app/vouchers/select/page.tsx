"use client";

import { useSearchParams } from "next/navigation";

import { VoucherSelectLayout } from "@/components/voucher/VoucherSelectLayout";

const SelectVoucherPage = () => {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  return <VoucherSelectLayout merchantId={merchantId} />;
};

export default SelectVoucherPage;
