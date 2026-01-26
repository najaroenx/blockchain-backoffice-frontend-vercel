"use client";
import AddIcon from "@mui/icons-material/Add";

export interface ICustomerRow {
  name: string;
  initial: string;
  color: string;
  points?: string;
  action?: string;
}

const CustomerRow = ({
  name,
  initial,
  color,
  points = "1000 PTS",
  action = "Transfer",
}: ICustomerRow) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-sm font-medium`}
      >
        {initial}
      </div>
      <span className="text-base font-semibold text-gray-100">{name}</span>
      <span className="text-base font-semibold text-gray-100">{points}</span>
      <span className="text-base font-semibold text-gray-100">{action}</span>
    </div>
    <button className="w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors">
      <AddIcon className="w-4 h-4 text-gray-400" />
    </button>
  </div>
);

export default CustomerRow;
