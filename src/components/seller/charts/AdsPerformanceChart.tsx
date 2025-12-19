"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const AdsPerformanceChart = () => {
  const series = [
    {
      name: "Clicks",
      type: "column",
      data: [230, 480, 410, 670, 220, 430, 250, 370, 520, 320, 180, 150],
    },
    {
      name: "Views",
      type: "line",
      data: [230, 680, 520, 330, 650, 240, 210, 420, 240, 240, 50, 90],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "30%",
      },
    },
    stroke: {
      width: [0, 3],
      curve: "smooth",
    },
    colors: ["#C4F0D6", "#4F86F8"], // Light green for bars, Blue for line
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "05 Jan",
        "07 Jan",
        "08 Jan",
        "09 Jan",
        "10 Jan",
        "11 Jan",
        "12 Jan",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Ads performance</h3>
        <div className="flex p-1 bg-slate-50 rounded-lg">
          <button className="px-3 py-1 text-xs font-medium bg-white shadow-sm rounded-md text-slate-800">
            All
          </button>
          <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800">
            Campaign
          </button>
          <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-800">
            Email
          </button>
        </div>
      </div>
      <Chart
        options={options}
        series={series}
        type="line"
        height={320}
        width="100%"
      />
    </div>
  );
};
