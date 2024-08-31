import Chart from "react-apexcharts";

type Props = {
  chart: any;
};

export const TopBranchStaticsChart: React.FC<Props> = ({ chart }) => {
  return (
    <div className="bg-white rounded-lg px-5 py-2">
      <Chart {...chart} />
    </div>
  );
};
