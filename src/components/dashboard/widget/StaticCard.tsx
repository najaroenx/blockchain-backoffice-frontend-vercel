import PropTypes from "prop-types";

interface Props {
  logo: React.ReactNode;
  title: string;
  value: number;
}

export const StaticCard: React.FC<Props> = ({ logo, title, value }) => {
  return (
    <div className="flex bg-white h-28 w-full md:basis-1/4 p-4 shadow-lg rounded-lg border border-blue-gray-100">
      <div className="flex flex-1 h-full w-full items-center">
        <div className=" bg-[#FF8901] px-2 py-2 rounded-xl">
          <div className="w-8 h-8 text-white">{logo}</div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-right">{value}</p>
      </div>
    </div>
  );
};
