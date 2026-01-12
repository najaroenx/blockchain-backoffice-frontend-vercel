"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LeadItem = ({
  index,
  label,
  value,
  colorClass,
}: {
  index: number;
  label: string;
  value: number;
  colorClass: string;
}) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-dashed border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
          {index}
        </div>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full rounded-full ${colorClass.replace(
              "text-",
              "bg-"
            )}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 ${colorClass}`}
        >
          {value}%
        </span>
      </div>
    </div>
  );
};

export const LeadPerformanceScore = () => {
  const series = [
    {
      name: "Score",
      data: [78, 57, 26, 76, 42],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "radar",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false,
      },
      parentHeightOffset: 0,
    },
    theme: {
      mode: "dark",
    },
    stroke: {
      width: 2,
      colors: ["#a855f7"],
    },
    fill: {
      opacity: 0.25,
      colors: ["#a855f7"],
    },
    markers: {
      size: 4,
      colors: ["#a855f7"],
      strokeColors: "#1a1a2e",
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["1", "2", "3", "4", "5"],
      labels: {
        show: true,
        style: {
          colors: ["#6b7280", "#6b7280", "#6b7280", "#6b7280", "#6b7280"],
          fontSize: "11px",
          fontFamily: "inherit",
        },
      },
    },
    yaxis: {
      show: false,
      max: 100,
      min: 0,
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: "rgba(255,255,255,0.05)",
          connectorColors: "rgba(255,255,255,0.05)",
          fill: {
            colors: ["transparent"],
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-2">
        Token Performance Score
      </h3>

      <div className="flex-1 flex items-center justify-center -my-4">
        <Chart
          options={options}
          series={series}
          type="radar"
          height={250}
          width="100%"
        />
      </div>

      <div className="space-y-1 mt-2">
        <LeadItem
          index={1}
          label="Transaction Volume"
          value={78}
          colorClass="text-emerald-400"
        />
        <LeadItem
          index={2}
          label="User Adoption"
          value={57}
          colorClass="text-amber-400"
        />
        <LeadItem
          index={3}
          label="Token Velocity"
          value={26}
          colorClass="text-rose-400"
        />
        <LeadItem
          index={4}
          label="Holder Growth"
          value={76}
          colorClass="text-purple-400"
        />
        <LeadItem
          index={5}
          label="Liquidity Score"
          value={42}
          colorClass="text-pink-400"
        />
      </div>
    </div>
  );
};
