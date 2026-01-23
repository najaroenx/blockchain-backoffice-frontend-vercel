"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IdefaultCardDashboard {
  title: string;
  value: string;
  title2: string;
  value2?: string;
  lineChartOptions: ApexOptions;
}
const DefaultCardDashboard = ({
  title = "จำนวนคูปอง ทั้งหมด",
  value = "0",
  title2 = "จำนวนคูปอง ทั้งหมด2",
  value2 = "0",
  lineChartOptions,
}: IdefaultCardDashboard) => {
  return (
    <div className="rounded-2xl shadow-lg shadow-black/20 overflow-hidden border border-gray-800 h-5/6">
      {/* Top section - Orders Provided (Dark) */}
      <div className="bg-gray-800/80 backdrop-blur-sm px-2 pt-6 pb-4">
        <p className="text-lg text-white font-bold truncate">{title}</p>

        {/* Line Chart */}
        <div className="h-12 mt-3">
          <Chart
            options={{
              ...lineChartOptions,
              colors: ["#a78bfa"],
              stroke: { curve: "smooth", width: 2 },
              fill: { type: "solid", opacity: 0 },
            }}
            series={[{ data: [8, 15, 10, 18, 12, 20, 15] }]}
            type="line"
            height="100%"
          />
        </div>

        <h3 className="text-4xl font-bold text-white mt-3">
          {value ? value.toLocaleString() : "0"}
        </h3>
      </div>

      {/* Bottom Section (Purple Gradient) - matching PrimaryCardDashboard structure */}
      <div className="grid grid-cols-1 h-1/2">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-2 flex items-center justify-between">
          <div>
            <p className="text-sm text-white flex items-center gap-1 font-medium truncate">
              {title2}
            </p>
            <p className="text-2xl font-bold text-white mt-1">
              {value2 ? value2.toLocaleString() : "0"}
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-2 flex items-center justify-between">
          <div className="w-full">
            {/* Progress Bar */}
            <div className="h-2 flex gap-1">
              <div className="h-full bg-purple-900/80 rounded-full w-[50%]" />
              <div className="h-full bg-purple-400/80 rounded-full w-[35%]" />
              <div className="h-full bg-purple-300/60 rounded-full w-[15%]" />
            </div>
            <div className="flex justify-between text-[11px] text-white mt-2">
              <span>Productive</span>
              <span>Middle</span>
              <span>Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultCardDashboard;
