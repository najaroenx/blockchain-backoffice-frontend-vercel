import { Suspense } from "react";
import { Loading } from "@/components/layout/Loading";

import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/components/admin/AdminApp"), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminApp />
    </Suspense>
  );
}
