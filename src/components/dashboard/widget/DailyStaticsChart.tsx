import Chart from "react-apexcharts";

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
      <div className="px-6 pt-0 py-2">
        <h6 className="text-black font-semibold">{title}</h6>
        <p className="font-normal text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
};
