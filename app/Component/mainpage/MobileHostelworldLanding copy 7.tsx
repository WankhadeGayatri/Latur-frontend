import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Search, ArrowRight } from "lucide-react";

const HostelBanner = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/Images/about/about-1.jpg",
    "/Images/about/about-2.jpg",
    "/Images/about/about-3.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 py-2 h-[430px] overflow-hidden relative">
      {/* Person Image in left corner */}
      <div
        className="absolute bottom-0 left-8 z-30"
        style={{ transform: "translateY(-10%)" }}
      >
        <img
          src="/Images/about/m.png"
          alt="Person"
          className="h-[300px] w-auto object-contain opacity-90 drop-shadow-lg"
        />
      </div>
      <div className="absolute inset-0 z-10 flex justify-start items-center pl-[12%]">
        {/* <img
          src="/lk.svg"
          alt="Background"
          className="w-auto h-[400px] object-contain opacity-65"
          style={{
            mixBlendMode: "overlay",
            filter: "brightness(1.2) contrast(1.1)",
          }}
        /> */}
        <img
          src="/builddemo.png"
          alt="Background"
          className="w-[550px]  h-[550px] object-contain opacity-75"
          style={{
            mixBlendMode: "overlay",
            filter: "brightness(1.2) contrast(1.1)",
          }}
        />
      </div>
      {/* Text and Search Container */}
      <div className="absolute w-full mt-[8%] z-20 flex flex-col items-center">
        {/* Text Content with Background Image */}
        <div className="space-y-8 text-center relative">
          {/* Background Image */}

          <h1 className="font-serif text-4xl lg:text-6xl text-white font-bold leading-tight drop-shadow-lg whitespace-nowrap relative z-10">
            Welcome to Latur Hostel
          </h1>

          <p className="font-serif text-base lg:text-xl text-white/90 italic drop-shadow-lg">
            Find Your Home, Away From Home
          </p>
        </div>

        {/* Search Bar Container */}
        <div className="mt-14 relative z-30 w-full max-w-3xl  mx-auto px-4">
          <div className="bg-white p-2 flex items-center rounded-lg shadow-lg">
            <div className="flex-grow">
              <div className="flex items-center text-gray-500">
                <Search size={20} className="ml-3 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search your Hostel"
                  className="w-full bg-transparent text-black text-lg py-4 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <button className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-10 py-4 rounded-lg flex items-center justify-center whitespace-nowrap text-lg font-semibold">
                Let's go!
                <ArrowRight size={16} className="ml-2 hidden sm:inline" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main row with two columns */}
      <div className="relative h-full flex">
        {/* Left column with brand gradient */}
        <div className="relative w-[45%] flex items-center bg-gradient-to-r from-[#FF8C42] via-[#5BB5E6] to-[#3A9BD8]">
          {/* Additional gradient overlays for depth and blending */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3A9BD8]/30 to-[#3A9BD8]/70" />
        </div>

        <div className="relative w-[55%]">
          {/* Enhanced gradient layers for better blending */}
          <div className="absolute inset-0 z-10">
            {/* Primary connection gradient */}
            <div className="absolute left-0 top-0 h-full w-[250px] bg-gradient-to-r from-[#3A9BD8] via-[#3A9BD8]/70 to-transparent" />

            {/* Additional subtle gradient layers */}
            <div className="absolute left-[100px] top-0 h-full w-[200px] bg-gradient-to-r from-[#3A9BD8]/40 via-[#3A9BD8]/20 to-transparent" />
            <div className="absolute left-[200px] top-0 h-full w-[150px] bg-gradient-to-r from-[#3A9BD8]/30 to-transparent" />

            {/* Vertical gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
          </div>

          {/* Image carousel container */}
          <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url('${image}')`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-black/10" />
        </div>
      </div>
    </div>
  );
};

export default HostelBanner;
