"use client";

import HeroSectionComponent from "@/components/HomePage/HeroSectionComponent";
import ServicesComponent from "@/components/HomePage/ServicesComponent";
import UniqueFeaturesComp from "@/components/HomePage/UniqueFeaturesComp";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-home-gradient">
      <HeroSectionComponent />
      <div id="services">
        <ServicesComponent />
      </div>
      <div id="features">
        <UniqueFeaturesComp />
      </div>
    </div>
  );
}
