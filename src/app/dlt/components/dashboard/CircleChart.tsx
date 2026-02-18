'use client';
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import StarIcon from "@mui/icons-material/Star";
import { useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ── Donut chart options ────────────────────────────────
const donutOpts: ApexOptions = {
  chart: { type: "donut", background: "transparent" },
  labels: ["Online", "Offline", "Direct"],
  colors: ["#a855f7", "#d946ef", "#ec4899"],
  stroke: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: { show: true, fontSize: "14px", color: "#9ca3af", offsetY: -8 },
          value: {
            show: true,
            fontSize: "28px",
            fontWeight: 700,
            color: "#f3f4f6",
            offsetY: 4,
          },
          total: {
            show: true,
            label: "Total",
            color: "#9ca3af",
            formatter: () => "140",
          },
        },
      },
    },
  },
  tooltip: { enabled: false },
};
interface ICircleChartProps {
  title: string;
  sub: string;
  series: number[];
  labels: string[];
}
const CircleChart: React.FC<ICircleChartProps> = ({
  title = "Your title",
  sub = "Sub title",
  series,
  labels,
}) => {
  const [donutOpt, setDonutOpt] = useState<ApexOptions>(donutOpts);
  return (
    <div className="bg-[#111827] rounded-2xl p-5 border border-gray-700/40 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <button className="flex items-center gap-1.5 text-sm text-gray-400 border border-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-800 transition">
          <RefreshOutlinedIcon sx={{ fontSize: 16 }} />
          Refresh
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center mt-2">
        <div className="w-[230px] h-[230px]">
          <Chart
            options={donutOpt}
            series={series}
            type="donut"
            height="100%"
            width="100%"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <span className="inline-flex items-center gap-1.5 bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full">
          <StarIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
          {sub}
        </span>
      </div>
    </div>
  );
};
export default CircleChart;
