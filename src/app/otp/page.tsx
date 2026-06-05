import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";
import { VerifyPhoneProvider } from "@/contexts/VerifyPhoneContext";
import VerifyPhone from "@/components/verifyPhone/VerifyPhone";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyPhoneProvider>
        <VerifyPhone />
      </VerifyPhoneProvider>
    </Suspense>
  );
}
