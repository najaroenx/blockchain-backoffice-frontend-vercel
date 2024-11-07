"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { api } from "@/libs/api";
import Link from "next/link";
import { Loading } from "../layout/Loading";

const MerchantPortal = () => {
  const { data: merchants, isLoading: merchantLoading } = useQuery({
    queryFn: async () => {
      return await api("/api/merchant", {
        method: "GET",
      });
    },
    queryKey: ["merchant"],
  });

  if (merchantLoading || !merchants)
    return (
      <div className="bg-slate-100 h-full w-full md:max-w-full">
        <div className="container mx-auto px-5 py-10">
          <Loading />
        </div>
      </div>
    );

  return (
    <div className="bg-slate-100 h-screen w-full md:max-w-full">
      <div className="container mx-auto px-5 py-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-[#1C2A53] font-bold">Merchant Portal</h1>
          <button className="py-3 px-2 text-white bg-[#FF8901] hover:bg-[#fbbf7a] rounded-xl font-black text-sm uppercase shadow-lg">
            new merchant
          </button>
        </div>
        <div className="mt-5">
          <hr className="border-slate-200 border-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {merchants.map((record: any) => (
            <div key={record.id}>
              <div className="relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-full px-5">
                <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white bg-clip-border rounded-xl h-44">
                  <Image
                    src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=927&amp;q=80"
                    alt="card-image"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900">
                      {record.name}
                    </p>
                  </div>
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75">
                    {record.website}
                  </p>
                </div>
                <div className="flex p-2 pt-0 justify-center">
                  <Link
                    href={`/admin/${record.id}`}
                    target="_blank"
                    className="text-sm font-bold uppercase bg-[#FF8901] hover:bg-[#fbbf7a] py-1.5 px-3 rounded-lg text-white"
                  >
                    Open Merchant
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchantPortal;
