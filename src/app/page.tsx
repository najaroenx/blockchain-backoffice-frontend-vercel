import { Loading } from "@/components/layout/Loading";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
const AdminApp = dynamic(() => import("@/components/admin/AdminApp"), {
  ssr: false,
});

const Home: NextPage = () => (
  <Suspense fallback={<Loading />}>
    <AdminApp />
  </Suspense>
);

export default Home;
