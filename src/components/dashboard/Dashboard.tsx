import { PointTransactionTable } from "./widget/PointTransactionTable";
import { StaticCard } from "./widget/StaticCard";
import { DailyStaticsChart } from "./widget/DailyStaticsChart";
import { dailySalesChart } from "@/data/statistics-charts-data";
import {
  WalletIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import { Loading } from "../layout/Loading";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/libs/api";
import { useStore } from "react-admin";
import { Empty } from "../layout/Empty";

export const Dashboard = () => {
  const [merchant] = useStore("currentMerchant");

  const { isPending, data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      return api(`/api/dashboard`, {
        method: "GET",
        headers: {
          "Merchant-Id": merchant,
        },
      });
    },
    enabled: !!merchant,
  });

  if (isPending && merchant)
    return (
      <div className="bg-slate-100 h-full w-full md:max-w-full">
        <div className="container mx-auto px-5 py-10">
          <Loading />
        </div>
      </div>
    );

  if (!merchant)
    return (
      <div className="bg-slate-100 h-full w-full md:max-w-full">
        <div className="container mx-auto px-5 py-10">
          <Empty isMerchant={true} />
        </div>
      </div>
    );

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
            title="Monthly Transaction"
            description="information monthly transaction"
            chart={dailySalesChart(data.transactionsMonthly)}
          />
          <DailyStaticsChart
            title="Monthly Redeem Transaction"
            description="information monthly redeem"
            chart={dailySalesChart(data.transactionsRedeemMonthly)}
          />
          <DailyStaticsChart
            title="Monthly Transfer Transaction"
            description="information monthly transfer"
            chart={dailySalesChart(data.transactionsTransferMonthly)}
          />
        </div>

        <div className="flex flex-col bg-white py-5 px-5 mt-10 shadow-lg rounded-lg gap-5">
          <h6 className="font-medium text-black">Transactions</h6>
          <PointTransactionTable transactions={data.transactions} />
        </div>
      </div>
    </div>
  );
};
