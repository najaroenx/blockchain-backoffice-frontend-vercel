import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";
import { VerifyPhoneProvider } from "@/contexts/VerifyPhoneContext";
import dynamic from "next/dynamic";
import PinPhoneNumber from "@/components/verifyPhone/PinPhoneNumber";
import VerifyPhoneComponent from "@/components/verifyPhone/VerifyPhone";

const VerifyPhone = dynamic(
  () => import("@/components/verifyPhone/VerifyPhone"),
  {
    ssr: false,
  }
);

export default function Page({ params }: { params: { phone: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyPhoneProvider value={params.phone}>
        <VerifyPhoneComponent />
      </VerifyPhoneProvider>
    </Suspense>
  );
}
