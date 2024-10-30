import Image from "next/image";

export const CollectionCard = () => {
  return (
    <div className="bg-white p-4 rounded-lg max-w-lg shadow-lg">
      <div className="relative w-full h-48">
        <Image
          src="https://raw.seadn.io/files/5989b6c83f9e0457bb6f4e962cd225f5.png"
          alt="Mythic Seed"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent opacity-80 rounded-lg"></div>
      </div>

      <div className="pt-4">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">PORSCHΞ 911</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12 2a10 10 0 0110 10v10H2V12A10 10 0 0112 2zm5.707 7.293a1 1 0 00-1.414 0L10 15.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <div className="flex justify-between text-sm mt-2">
          <div>
            <p className="font-bold">Total Supply</p>
            <p>205 NFTs</p>
          </div>
          <div>
            <p className="font-bold">Total Supply</p>
            <p>205 NFTs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
