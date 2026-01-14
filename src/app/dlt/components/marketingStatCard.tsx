import React from "react";

interface Props {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
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
    <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 hover:border-purple-500/20 transition-all group">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBgColor}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-white mb-2">{value}</h4>
        <p
          className={`text-xs font-semibold ${
            isPositive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {trend}{" "}
          <span className="text-gray-500 font-normal">vs last month</span>
        </p>
      </div>
    </div>
  );
};
