import {
  ApexOptions,
  type ApexAxisChartSeries,
  type ApexNonAxisChartSeries,
} from "apexcharts";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
interface IDefaultCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  chart: {
    type: "line" | "bar" | "radialBar";
    data: number[];
  };
  change: number; // percentage change (positive or negative)
  changeLabel: string; // e.g., "Since last week"
  option: ApexOptions;
  chartType: "line" | "bar" | "radialBar";
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  isUp: boolean; // true if change is positive, false if negative
}
const DefaultCard = ({
  title,
  value,
  icon,
  chart,
  change,
  changeLabel,
  option,
  chartType,
  series,
  isUp,
}: IDefaultCardProps) => {
  return (
    <div
      key={title}
      className="bg-[#111827] rounded-2xl p-5 border border-gray-700/40 flex flex-col justify-between min-h-[170px]"
    >
      {/* ── Header row ── */}
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          {title}
        </span>
      </div>

      {/* ── Value + Chart row ── */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>

        <div
          className={
            chart.type === "radialBar"
              ? "w-[70px] h-[70px] -mr-2 -mt-1"
              : "w-[100px] h-[50px]"
          }
        >
          <Chart
            options={option}
            series={series}
            type={chartType}
            height="100%"
            width="100%"
          />
        </div>
      </div>

      {/* ── Change row ── */}
      <div className="flex items-center gap-2 mt-3">
        <span
          className={`text-xs font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}
        >
          {change}%
        </span>
        <span
          className={`text-sm ${isUp ? "text-emerald-400" : "text-rose-400"}`}
        >
          {isUp ? "↗" : "↘"}
        </span>
        <span className="text-xs text-gray-400">{changeLabel}</span>
      </div>
    </div>
  );
};
export default DefaultCard;
