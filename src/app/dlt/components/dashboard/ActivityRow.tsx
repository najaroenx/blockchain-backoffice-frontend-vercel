"use client";
import React from "react";

export interface IActivityRow {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  change: string;
  changeType: "increase" | "decrease";
  value: string;
}

const ActivityRow = ({
  icon,
  iconBg,
  title,
  change,
  changeType,
  value,
}: IActivityRow) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p
          className={`text-xs ${changeType === "increase" ? "text-emerald-400" : "text-rose-400"}`}
        >
          {changeType === "increase" ? "Increased by" : "Decreased by"} {change}{" "}
          {changeType === "increase" ? "↑" : "↓"}
        </p>
      </div>
    </div>
    <span className="text-sm font-semibold text-white">{value}</span>
  </div>
);

export default ActivityRow;
