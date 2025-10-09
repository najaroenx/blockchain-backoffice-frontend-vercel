"use client";

import Link from "next/link";
const Marketplace = () => {
  const merchants = [
    {
      id: 1,
      name: "Merchant One",
      website: "www.merchantone.com",
      imageUrl:
        "https://images.unsplash.com/photo-1725182290901-e20c3ea7cbfb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
    },
    {
      id: 2,
      name: "Merchant Two",
      website: "www.merchanttwo.com",
      imageUrl:
        "https://images.unsplash.com/photo-1637290742802-3c8a0f5bd49b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
    },
    {
      id: 3,
      name: "Merchant Three",
      website: "www.merchantthree.com",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/b7/Taco_Bell_2023.svg/1920px-Taco_Bell_2023.svg.png",
    },
    {
      id: 4,
      name: "Merchant Four",
      website: "www.merchantfour.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Merchant Five",
      website: "www.merchantfive.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "Merchant Six",
      website: "www.merchantsix.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 7,
      name: "Merchant Seven",
      website: "www.merchantseven.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 8,
      name: "Merchant Eight",
      website: "www.merchanteight.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 9,
      name: "Merchant Nine",
      website: "www.merchantnine.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 10,
      name: "Merchant Ten",
      website: "www.merchantten.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 11,
      name: "Merchant Eleven",
      website: "www.merchanteleven.com",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 12,
      name: "Merchant Twelve",
      website: "www.merchanttwelve.com",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];
  return (
    <div className="bg-red-50 w-full h-screen px-8 py-4 flex flex-wrap gap-4 overflow-y-auto">
      {merchants.map((_, index) => (
        <div
          key={`index-of-merchant${index}`}
          className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-96 px-5 pb-3"
        >
          <div className="relative mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded h-44">
            <img
              src={_.imageUrl}
              alt="card-image"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                {_.name}
              </p>
            </div>
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
              {_.website}
            </p>
          </div>
          <div className="flex p-2 pt-0">
            <Link
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full  text-white bg-[#FF8901] shadow-none"
              href={"/marketplace/id=" + _.id}
            >
                Visit Store
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Marketplace;
