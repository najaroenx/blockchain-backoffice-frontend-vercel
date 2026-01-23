"use client";
import Image from "next/image";

export interface IStatCard {
  title: string;
  value: string;
  icon: string;
}

const StatCard = ({ title, value, icon }: IStatCard) => (
  <div className="group relative bg-gray-700/50 rounded-xl p-4 text-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex flex-col items-center justify-center overflow-hidden h-full cursor-pointer border border-transparent hover:border-purple-400/30">
    <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
      <span className="text-6xl">🌐</span>
    </div>
    <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full">
      <div style={{ width: "60px", height: "60px" }} className="relative mb-2">
        <Image
          src={icon}
          alt={title}
          width={60}
          height={60}
          style={{ objectFit: "contain" }}
        />
      </div>
      <p className="text-sm font-semibold text-gray-100 group-hover:text-white transition-colors">
        {title}
      </p>
      <p className="text-sm text-gray-400 group-hover:text-purple-200 transition-colors mt-1">
        {value}
      </p>
    </div>
  </div>
);

export default StatCard;
