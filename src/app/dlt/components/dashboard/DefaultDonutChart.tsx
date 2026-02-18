"use client";
import { useMemo } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/** Purple‑pink palette matching the brand gradient */
const PURPLE_PINK_PALETTE = [
  "#a855f7", // purple-500
  "#d946ef", // fuchsia-500
  "#ec4899", // pink-500
  "#8b5cf6", // violet-500
  "#c084fc", // purple-400
  "#f0abfc", // fuchsia-300
  "#f472b6", // pink-400
  "#7c3aed", // violet-600
  "#e879f9", // fuchsia-400
  "#fb7185", // rose-400
];

const generateColors = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => PURPLE_PINK_PALETTE[i % PURPLE_PINK_PALETTE.length]);

// ── Lead Source donut options ──────────────────────────
const leadSourceOpts: ApexOptions = {
  chart: { type: "donut", background: "transparent" },
  stroke: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          name: { show: true, fontSize: "14px", color: "#6b7280", offsetY: -8 },
          value: {
            show: true,
            fontSize: "28px",
            fontWeight: 700,
            color: "#1f2937",
            offsetY: 4,
          },
        },
      },
    },
  },
  tooltip: { enabled: false },
};
interface IDefaultDonutChartProps {
  title: string;
  sub: string;
  series: number[];
  labels: string[];
}
const DefaultDonutChart: React.FC<IDefaultDonutChartProps> = ({
  title = "",
  sub = "",
  series = [],
  labels = [],
}) => {
  const colors = useMemo(() => generateColors(labels.length), [labels.length]);

  return (
    <div className="bg-[#111827] rounded-2xl p-6 border border-gray-700/40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>

      {/* Donut chart */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[220px] h-[220px]">
          <Chart
            options={{ ...leadSourceOpts, labels, colors }}
            series={series}
            type="donut"
            height="100%"
            width="100%"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4">
        {labels.map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs text-gray-300">
              {label} : {series[idx]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefaultDonutChart;
