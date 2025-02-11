import React, { useState, useEffect } from "react";
import ConsultationType from "../components/Home/ConsultationType";
import { Features } from "../components/Home/Features";
import SliderHome from "../components/Home/SliderHome";
import { FeaturedDoctors } from "../components/Home/SpecialDoctor/FeaturedDoctors";
import { Specialties } from "../components/Home/Specialties";


function Home() {





  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 relative bg-gray-100" dir="rtl">
      {/* خلفية مائلة مع الشفافية */}
      <div className="absolute inset-0 bg-mainColor bg-opacity-50 skew-y-3 transform -z-10 h-[99%] -mt-10"></div>

 

      {/* المكونات الفرعية */}
      <SliderHome />
      <ConsultationType />
      <Specialties />
      <FeaturedDoctors />
      <Features />
    </div>
  );
}

export default Home;
