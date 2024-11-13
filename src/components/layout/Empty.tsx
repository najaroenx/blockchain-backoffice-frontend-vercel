export const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-20 md:mt-48 bg-gray-100 w-full">
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
            strokeWidth="2"
            d="M3 10h18M9 16h6M6 20h12M3 6h18"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-semibold text-gray-600">
          No Data Available
        </h2>

        <div className="flex flex-col gap-5">
          <p className="mt-2 text-gray-500">
            There is currently no data to display. Please create new one.
          </p>
        </div>
      </div>
    </div>
  );
};
