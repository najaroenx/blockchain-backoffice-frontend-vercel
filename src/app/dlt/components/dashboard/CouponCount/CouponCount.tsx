import { useMemo } from "react";
import { ApexOptions, type ApexAxisChartSeries } from "apexcharts";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import DefaultCard from "../DefaultCard";

const areaOpts = (color: string): ApexOptions => ({
  chart: {
    type: "area",
    sparkline: { enabled: true },
    toolbar: { show: false },
    background: "transparent",
  },
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 },
  },
  colors: [color],
  tooltip: { enabled: false },
  xaxis: {
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { show: false },
  grid: { show: false },
});

// ── Mapping config ─────────────────────────────────────
const couponFields: {
  key: keyof ICouponCountProps["couponCount"];
  title: string;
}[] = [
  { key: "total", title: "คูปองทั้งหมด" },
  { key: "unsold", title: "คูปองที่ยังไม่ได้ขาย" },
  { key: "sold", title: "คูปองที่ขายแล้ว" },
  { key: "unredeemed", title: "คูปองที่ขายแล้ว End User ยังไม่ redeem" },
  { key: "redeemed", title: "คูปองที่ End User ได้ทำการ redeem แล้ว" },
];

interface ICouponCountProps {
  couponCount: {
    total: number;
    unsold: number;
    sold: number;
    unredeemed: number;
    redeemed: number;
  };
}

const CouponCount = ({ couponCount }: ICouponCountProps) => {
  const stats = useMemo(
    () =>
      couponFields.map((field) => ({
        title: field.title,
        value: couponCount[field.key].toString(),
      })),
    [couponCount]
  );

  const chartData = [15, 30, 20, 40, 35, 50, 45, 55, 60];
  const options = areaOpts("#3b82f6");
  const series: ApexAxisChartSeries = [{ name: "", data: chartData }];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
      {stats.map((stat) => (
        <DefaultCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={
            <WorkOutlineOutlinedIcon
              sx={{ fontSize: 20, color: "#9ca3af" }}
            />
          }
          chart={{ type: "line", data: chartData }}
          change={0}
          changeLabel="0 Up"
          option={options}
          chartType="line"
          series={series}
          isUp={false}
        />
      ))}
    </div>
  );
};
export default CouponCount;
