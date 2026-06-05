"use client";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
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
    bar: { columnWidth: "45%", borderRadius: 4 },
  },
  colors: ["#a855f7", "#d946ef"],
  stroke: { width: [0, 0, 3, 3], curve: "smooth" },
  fill: {
    opacity: [1, 1, 1, 1],
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
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

const overviewSeries = [
  {
    name: "Revenue",
    type: "bar",
    data: [28000, 18000, 32000, 24000, 40000, 52000],
  },
  {
    name: "Cost",
    type: "bar",
    data: [22000, 15000, 26000, 20000, 35000, 45000],
  },
  {
    name: "Orders",
    type: "line",
    data: [25000, 20000, 22000, 24000, 22000, 26000],
  },
  {
    name: "Trend",
    type: "line",
    data: [30000, 22000, 35000, 30000, 45000, 55000],
  },
];
const CircleChart2 = () => {
  return (
    <div className="flex gap-5">
      {/* Left sidebar stats */}
      <div className="w-[220px] flex-shrink-0 flex flex-col gap-4">
        {/* Alert banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
          <ChatBubbleOutlineOutlinedIcon
            sx={{ fontSize: 18, color: "#f59e0b", mt: 0.25 }}
          />
          <p className="text-xs text-amber-400 leading-relaxed">
            We regret to inform you that our server is down.
            <span className="font-bold text-amber-300 cursor-pointer">
              Refresh
            </span>
          </p>
        </div>

        {/* Mini stats 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Revenue</p>
            <div className="flex items-center gap-1.5">
              <MonetizationOnOutlinedIcon
                sx={{ fontSize: 16, color: "#9ca3af" }}
              />
              <span className="text-sm font-bold text-white">$56.63k</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">
              ↓ 3.91%
            </span>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">Orders</p>
            <div className="flex items-center gap-1.5">
              <LocalShippingOutlinedIcon
                sx={{ fontSize: 16, color: "#9ca3af" }}
              />
              <span className="text-sm font-bold text-white">9,842</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              ↑ 8.72%
            </span>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">New Users</p>
            <div className="flex items-center gap-1.5">
              <GroupAddOutlinedIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
              <span className="text-sm font-bold text-white">95.30k</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold">
              ↑ 11.2%
            </span>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-1">New Contract</p>
            <div className="flex items-center gap-1.5">
              <DescriptionOutlinedIcon
                sx={{ fontSize: 16, color: "#9ca3af" }}
              />
              <span className="text-sm font-bold text-white">851</span>
            </div>
            <span className="text-[11px] text-rose-400 font-semibold">
              ↓ 0%
            </span>
          </div>
        </div>

        {/* Refresh Data button */}
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition w-fit">
          <RefreshOutlinedIcon sx={{ fontSize: 14 }} />
          Refresh Data
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[280px]">
        <Chart
          options={overviewChartOpts}
          series={overviewSeries}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};
export default CircleChart2;
