"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ── Overview mixed chart options ───────────────────────
const overviewChartOpts: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
    background: "transparent",
    fontFamily: "inherit",
  },
  plotOptions: {
    bar: { columnWidth: "30px", borderRadius: 4 },
  },
  colors: ["#a855f7", "#d946ef"],
  stroke: { width: [0, 0, 3, 3], curve: "smooth" },
  fill: {
    opacity: [1, 1, 1, 1],
  },
  xaxis: {
    labels: { style: { colors: "#9ca3af" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#9ca3af" },
      formatter: (v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`),
    },
  },
  grid: { borderColor: "#e5e7eb20", strokeDashArray: 4 },
  legend: { show: false },
  tooltip: { theme: "dark" },
  dataLabels: { enabled: false },
};
interface IViewSeries {
  name: string;
  type: "line" | "bar";
  data: number[];
}
interface IDefaultBarChartProps {
  title?: string;
  sub?: string;
  series?: IViewSeries[];
  labels?: string[];
}
const DefaultBarChart = ({
  title = "Overview",
  sub = "(Current Year)",
  series = [],
  labels = [],
}: IDefaultBarChartProps) => {
  return (
    <div className="xl:col-span-2 bg-[#111827] rounded-2xl p-6 border border-gray-700/40">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <span className="text-sm text-gray-400">{sub}</span>
        </div>
      </div>
      <div className="flex gap-5">
        {/* Chart */}
        <div className="flex-1">
          <Chart
            options={{
              ...overviewChartOpts,
              xaxis: { ...overviewChartOpts.xaxis, categories: labels },
            }}
            series={series}
            type="line"
            height={280}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default DefaultBarChart;
