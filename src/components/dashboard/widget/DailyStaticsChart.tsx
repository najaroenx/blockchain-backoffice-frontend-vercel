import Chart from "react-apexcharts";
import { ClockIcon } from "@heroicons/react/24/solid";

type Props = {
  description: string;
  title: string;
  chart: any;
};

export const DailyStaticsChart: React.FC<Props> = ({
  title,
  description,
  chart,
}) => {
  return (
    <div className="border border-blue-gray-100 shadow-lg text-blue-300 bg-white rounded-lg px-5 py-2">
      <div>
        <Chart {...chart} />
      </div>
      <div className="px-6 pt-0">
        <h6 className="text-black font-semibold">{title}</h6>
        <p className="font-normal text-gray-400 text-sm">{description}</p>
      </div>
      <div className="border-t border-blue-gray-50 px-6 py-2 mt-5">
        <p className="flex items-center font-normal text-gray-400 gap-2">
          <ClockIcon strokeWidth={2} className="h-4 w-4 text-gray-400" />
          updated 4 min ago
        </p>
      </div>
    </div>
  );
};
