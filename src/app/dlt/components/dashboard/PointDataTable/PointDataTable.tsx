import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
export interface IColumn {
  key: string;
  label: string;
}

export interface IPointDataTableProps {
  title?: string;
  columns?: IColumn[];
  rows?: Record<string, unknown>[];
}

const PointDataTable = ({
  title = "Data Table",
  columns = [],
  rows = [],
}: IPointDataTableProps) => {
  return (
    <div className="bg-[#111827] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-600 rounded-lg px-3 py-1.5">
            <SearchOutlinedIcon sx={{ fontSize: 16, color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none w-32"
            />
          </div>
          {/* Dots menu */}
          <button className="text-gray-400 hover:text-gray-200">
            <MoreHorizIcon sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase text-left py-3 px-3"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-gray-500"
                >
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-4 px-3 text-sm text-gray-300"
                  >
                    {String(row[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-emerald-400">Showing 1 to 5 of 12 deals</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition">
              <KeyboardArrowLeftIcon sx={{ fontSize: 18 }} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition ${
                  p === 1
                    ? "bg-indigo-500 text-white"
                    : "border border-gray-600 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button className="w-8 h-8 rounded-lg border border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition">
              <KeyboardArrowRightIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>
    </div>
  );
};

export default PointDataTable;
