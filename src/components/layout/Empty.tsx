import { Link, useCreatePath } from "react-admin";

interface Props {
  isMerchant: boolean;
}

export const Empty = ({ isMerchant = true }: Props) => {
  const createPath = useCreatePath();

  return (
    <div className="flex flex-col items-center justify-center h-full mt-20 md:mt-48 bg-gray-100">
      <div className="text-center">
        <svg
          className="w-24 h-24 mx-auto text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 10h18M9 16h6M6 20h12M3 6h18"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-gray-600">
          No Data Available
        </h2>

        {isMerchant && (
          <div className="flex flex-col gap-5">
            <p className="mt-2 text-gray-500">
              There is currently no data to display. Please create new one.
            </p>
            <Link
              to={createPath({
                resource: "merchant",
                type: "create",
              })}
              underline="none"
              color="inherit"
            >
              <button className="py-3 px-2 text-white bg-[#FF8901] hover:bg-[#fbbf7a] rounded-lg text-sm">
                CREATE MERCHANT
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
