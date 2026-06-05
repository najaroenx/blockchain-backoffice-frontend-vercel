"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import React from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface IMiniStatCard {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  chartData: number[];
  chartColor: string;
}

const MiniStatCard = ({
  icon,
  iconBg,
  title,
  value,
  change,
  changeType,
  chartData,
  chartColor,
}: IMiniStatCard) => {
  const lineChartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: true },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 },
    },
    colors: [chartColor],
    tooltip: { enabled: false },
    theme: { mode: "dark" },
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          <p
            className={`text-sm ${changeType === "increase" ? "text-emerald-400" : "text-rose-400"} flex items-center gap-1 mt-1`}
          >
            <span>{changeType === "increase" ? "↗" : "↘"}</span> {change}
          </p>
        </div>
        <div className="w-20 h-10">
          <Chart
            options={lineChartOptions}
            series={[{ data: chartData }]}
            type="line"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default MiniStatCard;
