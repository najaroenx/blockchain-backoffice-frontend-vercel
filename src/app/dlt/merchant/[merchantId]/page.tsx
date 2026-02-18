import { Suspense } from "react";
import { ClientDashboard } from "../../components/dashboard";
import LoadingDefaultComponent from "../../components/LoadingDefaultComponent";

export const dynamic = "force-dynamic";

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ merchantId: string }>;
}) => {
  const { merchantId } = await params;
  return (
    <Suspense fallback={<LoadingDefaultComponent className="w-54 h-54" />}>
      <ClientDashboard merchantId={merchantId} />
    </Suspense>
  );
};
export default DashboardPage;
