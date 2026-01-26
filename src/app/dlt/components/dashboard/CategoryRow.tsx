"use client";

export interface ICategoryRow {
  name: string;
  value?: string | number;
  count?: string;
  bgColor: string;
  textColor: string;
}

const CategoryRow = ({
  name,
  value = "0",
  count = "",
  bgColor,
  textColor,
}: ICategoryRow) => (
  <div
    className={`flex items-center justify-between py-3 px-4 rounded-full ${bgColor}`}
  >
    <span className={`text-sm font-semibold ${textColor}`}>{name}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-gray-100">{value}</span>
      {/* <span className="text-xs text-gray-400">{count}</span> */}
    </div>
  </div>
);

export default CategoryRow;
