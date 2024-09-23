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

interface State {
  transactions?: any[];
  customers?: any[];
}

export const Dashboard = () => {
  const { data: transactions, isLoading: transactionLoading } =
    useGetList<any>("transaction");

  const { data: customers, isLoading: customerLoading } =
    useGetList<any>("customer");

  const aggregation = useMemo<State>(() => {
    if (!transactions && !customers) return {};
    return {
      transactions,
      customers,
    };
  }, [transactions, customers]);

  if (transactionLoading || customerLoading) return <Loading />;

  return (
    <div className="bg-slate-100 h-full max-w-sm md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex flex-col">
          <h1 className="font-medium text-2xl text-[#1C2A53] py-3">
            Dashboard
          </h1>
          <div className="flex flex-wrap md:flex-nowrap mt-5 gap-4">
            <StaticCard
              logo={
                <>
                  <WalletIcon />
                </>
              }
              title="Customer Wallets"
              value={aggregation.customers?.length || 0}
            />
            <StaticCard
              logo={
                <>
                  <ChartBarIcon />
                </>
              }
              title="Today's Transactions"
              value={aggregation.transactions?.length || 0}
            />
            <StaticCard
              logo={
                <>
                  <CurrencyDollarIcon />
                </>
              }
              title="Today's Customer Earns"
              value={1000}
            />
            <StaticCard
              logo={
                <>
                  <ShoppingBagIcon />
                </>
              }
              title="Today's Customer Spends"
              value={1000}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3 my-10">
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
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex flex-col bg-white py-5 px-5 mt-10 shadow-lg rounded-lg gap-5 overflow-hidden  w-full">
            <h6 className="font-medium text-black">Top 5 Holders</h6>
            <TopHolderTable />
          </div>
          <div className="flex flex-col bg-white py-5 px-5 mt-10 shadow-lg rounded-lg gap-5  w-full">
            <h6 className="font-medium text-black">Top Transaction</h6>
            <div className="w-full">
              <TopBranchStaticsChart chart={topBranchTransaction} />
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white w-full py-5 px-5 mt-10 shadow-lg rounded-lg gap-5">
          <h6 className="font-medium text-black">Transactions</h6>
          <div className="flex w-full justify-center">
            <PointTransactionTable transactions={aggregation.transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};
