import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";
import { VerifyPhoneProvider } from "@/contexts/VerifyPhoneContext";
import dynamic from "next/dynamic";

const VerifyPhone = dynamic(
  () => import("@/components/verifyPhone/VerifyPhone"),
  {
    ssr: false,
  }
);

export default function Page({ params }: { params: { phone: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyPhoneProvider phoneNumber={params.phone}>
        <VerifyPhone />
      </VerifyPhoneProvider>
    </Suspense>
  );
}
