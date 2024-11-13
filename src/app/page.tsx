"use client";

import { Hero } from "@/components/layout/Hero";
import { NavbarHero } from "@/components/layout/NavbarHero";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <NavbarHero />
      <div className="min-h-screen flex flex-col container mx-auto">
        <Hero />
      </div>
    </>
  );
};

export default Home;
