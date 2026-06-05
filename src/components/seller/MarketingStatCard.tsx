import React from "react";

interface Props {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor: string; // e.g., "bg-pink-100 text-pink-500"
}

export const MarketingStatCard: React.FC<Props> = ({
  title,
  value,
  trend,
  isPositive,
  icon,
  iconBgColor,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${iconBgColor}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mb-2">{value}</h4>
        <p
          className={`text-xs font-semibold ${
            isPositive ? "text-emerald-500" : "text-rose-500"
          }`}
        >
          {isPositive ? "+" : ""}
          {trend}{" "}
          <span className="text-slate-400 font-normal">vs last month</span>
        </p>
      </div>
    </div>
  );
};
