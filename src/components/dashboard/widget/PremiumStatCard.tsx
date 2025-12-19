import React from "react";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
  chartData?: number[]; // Simple array for a mini sparkline
}

export const PremiumStatCard: React.FC<PremiumStatCardProps> = ({
  title,
  value,
  trend,
  icon,
  description,
  chartData,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md border border-gray-100">
      {/* Background Decorative Gradient */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-transparent opacity-50 blur-2xl transition-all group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          </div>
          {icon && (
            <div className="rounded-xl bg-orange-50 p-2 text-[#FF8901] ring-1 ring-inset ring-orange-100/20">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={`flex items-center text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                ) : (
                  <svg
                    className="mr-1 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <span className="text-xs text-gray-400 font-medium">
                {description}
              </span>
            )}
          </div>

          {/* Simple Sparkline Representation */}
          {chartData && (
            <div className="flex items-end gap-1 h-8">
              {chartData.map((val, i) => (
                <div
                  key={i}
                  className="w-1 bg-orange-200 rounded-t-sm transition-all group-hover:bg-[#FF8901]"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
