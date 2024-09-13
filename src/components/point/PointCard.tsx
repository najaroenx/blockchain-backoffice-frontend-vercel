interface Props {
  name: string;
  contractAddress: string;
}

export const PointCard: React.FC<Props> = ({ name, contractAddress }) => {
  return (
    <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full px-5">
      <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-44">
        <img
          src="https://media.discordapp.net/attachments/1033975412444893264/1072422794983378974/Component_4.png?ex=66df504e&is=66ddfece&hm=0cbe457939b17f6a98dee84d9e9b80aad61ad79842c863959cf0fae169530a3c&=&format=webp&quality=lossless&width=1170&height=1170"
          alt="card-image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
            {name}
          </p>
        </div>
        <p className="block font-sans text-sm font-normal text-gray-700 opacity-75 overflow-hidden text-ellipsis whitespace-nowrap">
          {contractAddress}
        </p>
      </div>
      <div className="p-2 pt-0">
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          type="button"
        >
          Edit Point
        </button>
      </div>
    </div>
  );
};
