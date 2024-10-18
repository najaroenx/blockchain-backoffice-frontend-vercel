import { PointTransactionTable } from "./widget/PointTransactionTable";
import { StaticCard } from "./widget/StaticCard";
import { DailyStaticsChart } from "./widget/DailyStaticsChart";
import { dailySalesChart } from "@/data/statistics-charts-data";
import { topBranchTransaction } from "@/data/statistics-branch-data";
import {
  WalletIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { TopHolderTable } from "./widget/TopHolderTable";
import { TopBranchStaticsChart } from "./widget/TopBranchStaticsChart";
import { useGetList } from "react-admin";
import { useMemo } from "react";
import { Loading } from "../layout/Loading";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/api";

interface State {
  transactions?: any[];
  customers?: any[];
}

export const Dashboard = () => {
  const merchantId = localStorage.getItem("RaStore.currentMerchant");
  const cleanedMerchantId = merchantId ? merchantId.replace(/"/g, "") : "";

  const { data: transactions, isLoading: transactionLoading } =
    useGetList<any>("transaction");

  const { isPending, data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => {
      return api(`/api/dashboard`, {
        method: "GET",
        headers: {
          "Merchant-Id": cleanedMerchantId,
        },
      });
    },
  });

  const aggregation = useMemo<State>(() => {
    if (!transactions) return {};
    return {
      transactions,
    };
  }, [transactions]);

  if (transactionLoading || isPending) return <Loading />;

  return (
    <div className="bg-slate-100 h-full w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          <h1 className="font-medium text-2xl text-[#1C2A53]">Dashboard</h1>
          <div className="flex flex-wrap md:flex-nowrap mt-5 gap-5">
            <StaticCard
              logo={
                <>
                  <WalletIcon />
                </>
              }
              title="Customer Wallets"
              value={data.customerWallet || 0}
            />
            <StaticCard
              logo={
                <>
                  <ChartBarIcon />
                </>
              }
              title="Today's Transactions"
              value={data.transactionsToday || 0}
            />
            <StaticCard
              logo={
                <>
                  <CurrencyDollarIcon />
                </>
              }
              title="Today's Customer Redeem"
              value={data.totalRedeem || 0}
            />
            <StaticCard
              logo={
                <>
                  <ShoppingBagIcon />
                </>
              }
              title="Today's Customer Transfer"
              value={data.totalTransfer || 0}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 md:mt-10">
          <DailyStaticsChart
            title="Daily Claimed"
            description="information daily claimed"
            chart={dailySalesChart}
          />
          <DailyStaticsChart
            title="Daily Earned"
            description="information daily earned"
            chart={dailySalesChart}
          />
          <DailyStaticsChart
            title="Daily Spend"
            description="information daily spend"
            chart={dailySalesChart}
          />
        </div>
        {/* <div className="gap-10 mt-10">
          <div className="flex flex-col bg-white py-5 px-5 shadow-lg rounded-lg gap-5 overflow-hidden">
            <h6 className="font-medium text-black">Top 5 Holders</h6>
            <div className="w-full">
              <TopHolderTable />
            </div>
          </div>
        </div> */}
        <div className="flex flex-col bg-white py-5 px-5 mt-10 shadow-lg rounded-lg gap-5">
          <h6 className="font-medium text-black">Transactions</h6>
          <PointTransactionTable transactions={aggregation.transactions} />
        </div>
      </div>
    </div>
  );
};
