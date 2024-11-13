import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export const Hero = () => {
  const { status } = useSession();

  return (
    <div className="flex flex-col md:flex-row h-screen w-full mx-auto mt-8 md:mt-0">
      <div className="flex flex-col w-full md:h-full md:justify-center items-center">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">
          Kiwali Loyalty Program
        </h1>
        <p className="mt-2 leading-relaxed text-center px-5 py-5 text-sm md:text-base font-medium text-[#878585]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
        <Link
          className="group relative inline-flex items-center overflow-hidden rounded-full w-1/2 border border-current px-8 py-3 bg-[#ff9010] text-white focus:outline-none focus:ring active:text-[#ffb35c] justify-center hover:bg-[#fab361]"
          href={status === "authenticated" ? "/portal" : "/auth/sign-in"}
        >
          <span className="hidden md:block absolute -end-full transition-all group-hover:end-24">
            <svg
              className="size-5 rtl:rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>

          <span className="text-sm font-bold md:transition-all group-hover:me-4 py-2">
            Get Started
          </span>
        </Link>
      </div>
      <div className="md:flex justify-center h-full w-full items-center mt-10 md:mt-0">
        <Image
          src="/images/woman-cashier.png"
          alt="Faq image"
          width={1000}
          height={1000}
          className="w-full h-auto rounded-3xl"
        />
      </div>
    </div>
  );
};
