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
    <div className="flex items-center justify-between py-3 border-b border-dashed border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
          {index}
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="flex items-center gap-2 flex-1 justify-end">
        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
          {/* Using inline style for width as it's dynamic */}
          <div
            className={`h-full rounded-full opacity-50 ${colorClass.replace(
              "text-",
              "bg-"
            )}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${colorClass
            .replace("text-", "bg-")
            .replace("600", "100")} ${colorClass}`}
        >
          {value}%
        </span>
      </div>
    </div>
  );
};

export const LeadPerformanceScore = () => {
  // Data matches the labels order: Lead Volume, Conversion Rate, Lead Quality, Response Time, Cost per Lead
  // But Radar charts usually start from top clockwise.
  // Top=1, Right=2, BottomRight=3, BottomLeft=4, Left=5
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
      toolbar: {
        show: false,
      },
      parentHeightOffset: 0,
    },
    stroke: {
      width: 2,
      colors: ["#4F86F8"],
    },
    fill: {
      opacity: 0.2,
      colors: ["#4F86F8"],
    },
    markers: {
      size: 3,
      colors: ["#4F86F8"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    xaxis: {
      categories: ["1", "2", "3", "4", "5"],
      labels: {
        show: true,
        style: {
          colors: ["#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8"],
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
          strokeColors: "#f1f5f9",
          connectorColors: "#f1f5f9",
        },
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Lead performance score
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
          label="Lead Volume"
          value={78}
          colorClass="text-emerald-600"
        />
        <LeadItem
          index={2}
          label="Conversion Rate"
          value={57}
          colorClass="text-amber-500"
        />
        <LeadItem
          index={3}
          label="Lead Quality"
          value={26}
          colorClass="text-rose-500"
        />
        <LeadItem
          index={4}
          label="Response Time"
          value={76}
          colorClass="text-emerald-600"
        />
        <LeadItem
          index={5}
          label="Cost per Lead"
          value={42}
          colorClass="text-orange-500"
        />
      </div>
    </div>
  );
};
