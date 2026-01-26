"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamic import for ApexCharts (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IPrimaryCardDashboard {
  title: string;
  value: string;
  title2: string;
  value2?: string;
  title3: string;
  value3?: string;
  lineChartOptions: ApexOptions;
}
const PrimaryCardDashboard = ({
  title = "จำนวนคูปอง ทั้งหมด",
  value = "0",
  title2 = "จำนวนคูปอง ทั้งหมด2",
  value2 = "0",
  title3 = "จำนวนคูปอง ทั้งหมด3",
  value3 = "0",
  lineChartOptions,
}: IPrimaryCardDashboard) => {
  return (
    <div className="rounded-2xl shadow-lg shadow-black/20 overflow-hidden border border-gray-800 h-5/6">
      {/* Top section - Pink/Purple gradient */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-5 pt-6 pb-4 relative">
        {/* Arrow button */}
        <button className="absolute top-3 right-3 w-9 h-9 bg-pink-400/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-md hover:bg-pink-400/70 transition-colors">
          <span className="text-lg">↗</span>
        </button>

        <p className="text-lg text-white font-bold">{title}</p>

        {/* Line Chart */}
        <div className="h-14 mt-3">
          <Chart
            options={{
              ...lineChartOptions,
              colors: ["#f43782"],
              stroke: { curve: "smooth", width: 2 },
              fill: { type: "solid", opacity: 0 },
            }}
            series={[{ data: [12, 18, 10, 22, 8, 15, 25, 12, 20] }]}
            type="line"
            height="100%"
          />
        </div>
        <h3 className="text-4xl font-bold text-white mt-3">{10000000}</h3>
      </div>

      {/* Store Product Section (Dark) */}
      <div className="grid grid-cols-1 h-1/2">
        <div className="bg-gray-800/80 backdrop-blur-sm px-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white flex items-center gap-1 font-medium truncate">
              {title2}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{value2}</p>
          </div>
        </div>
        <div className="bg-gray-800/80 backdrop-blur-sm px-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-white flex items-center gap-1 font-medium truncate">
              {title3}
            </p>
            <p className="text-2xl font-bold text-white mt-1">{value3}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimaryCardDashboard;
