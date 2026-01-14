"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const AdsPerformanceChart = () => {
  const series = [
    {
      name: "Transactions",
      type: "column",
      data: [230, 480, 410, 670, 220, 430, 250, 370, 520, 320, 180, 150],
    },
    {
      name: "Volume",
      type: "line",
      data: [230, 680, 520, 330, 650, 240, 210, 420, 240, 240, 50, 90],
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "inherit",
      background: "transparent",
      toolbar: {
        show: false,
      },
    },
    theme: {
      mode: "dark",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "35%",
      },
    },
    stroke: {
      width: [0, 3],
      curve: "smooth",
    },
    colors: ["#a855f7", "#ec4899"], // Purple for bars, Pink for line
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#9ca3af",
      },
      markers: {
        size: 6,
      },
    },
    xaxis: {
      categories: [
        "01 Jan",
        "02 Jan",
        "03 Jan",
        "04 Jan",
        "05 Jan",
        "06 Jan",
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
          colors: "#6b7280",
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        style: {
          colors: "#6b7280",
        },
      },
    },
    grid: {
      borderColor: "rgba(255,255,255,0.05)",
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Blockchain Activity</h3>
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
          <button className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 rounded-md text-white shadow-lg">
            All
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            Tokens
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors">
            NFTs
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
