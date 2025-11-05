"use client";
import Image from "next/image";
import Link from "next/link";
const MerchantDetail = () => {
  const products = [
    {
      id: 1,
      name: "Product One",
      description: "This is product one",
      price: "$10",
      point: "100",
      imageUrl:
        "https://images.unsplash.com/photo-1725182290901-e20c3ea7cbfb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
    },
    {
      id: 2,
      name: "Product Two",
      description: "This is product two",
      price: "$20",
      point: "200",
      imageUrl:
        "https://images.unsplash.com/photo-1725182290901-e20c3ea7cbfb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
    },
    {
      id: 3,
      name: "Product Three",
      description: "This is product three",
      price: "$30",
      point: "300",
      imageUrl:
        "https://images.unsplash.com/photo-1725182290901-e20c3ea7cbfb?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=927&amp;q=80",
    },
  ];
  return (
    <div className="bg-red-50 w-full h-screen px-8 py-4 flex flex-wrap gap-4 overflow-y-auto">
      {products.map((_, index) => (
        <div
          key={`index-of-merchant${index}`}
          className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl h-1/3 w-40 px-5 pb-3"
        >
          <div className="relative mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded h-44">
            <Image
              src={_.imageUrl}
              alt="Merchant Logo"
              width={50}
              height={50}
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
              {_.description}
            </p>
          </div>
          <div className="flex p-2 pt-0">
            <Link
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg shadow-gray-900/10 hover:shadow-gray-900/20 focus:opacity-[0.85] active:opacity-[0.85] active:shadow-none block w-full  text-white bg-[#FF8901] shadow-none"
              href={"/marketplace/id=" + _.id}
            >
              buy for {_.point} points
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MerchantDetail;
