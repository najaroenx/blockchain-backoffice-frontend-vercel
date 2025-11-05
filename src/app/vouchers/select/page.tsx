"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VoucherSelectLayout } from "@/components/voucher/VoucherSelectLayout";


const SelectVoucherContent = () => {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");

  return <VoucherSelectLayout merchantId={merchantId ?? undefined} />;
};

const SelectVoucherPage = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SelectVoucherContent />
    </Suspense>
  );
};

export default SelectVoucherPage;
