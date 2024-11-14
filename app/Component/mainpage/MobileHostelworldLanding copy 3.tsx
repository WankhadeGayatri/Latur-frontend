import React from "react";
import Image from "next/image";
import { Button } from "@mui/material";

interface HostelBannerProps {
  onEnquire?: () => void;
}

const HostelBanner: React.FC<HostelBannerProps> = ({ onEnquire }) => {
  return (
    <div className="relative w-full h-[600px] bg-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-12 left-24 w-48 h-48 bg-gradient-to-br from-[#FFE5D9] to-[#BDE0FF] rounded-lg -rotate-6 opacity-80" />

      {/* Main content container */}
      <div className="relative h-full w-full flex items-center px-12 gap-2">
        {/* Left side content - adjusted height */}
        <div className="w-[70%] flex flex-col gap-2 h-[500px] z-10">
          {/* First row - 80% height */}
          <div className="h-[80%] flex gap-4">
            {/* Text column - 60% */}
            <div className="w-[80%] flex flex-col items-center justify-center text-center">
              <h1 className="font-serif font-bold text-5xl text-black mb-4 leading-tight">
                Welcome to Latur Hostel
              </h1>
              <p className="font-serif text-xl text-gray-700 mb-8 italic">
                Find Your Home, Away From Your Home
              </p>
            </div>

            <div className="w-[20%] h-[100%] bg-gradient-to-b from-[#FFE5D9] to-[#BDE0FF] opacity-75" />
          </div>

          {/* Second row - 20% height split into two columns */}
          <div className="h-[20%] w-full flex gap-2">
            {/* First column - gradient color */}
            <div className="w-1/2 bg-gradient-to-r from-[#FFE5D9] to-[#BDE0FF] opacity-75" />

            {/* Second column - image */}
            <div className="w-1/2 relative overflow-hidden">
              <Image
                src="/Images/about/about-2.jpg"
                alt="Hostel facilities"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>
          </div>
        </div>

        {/* Right side image grid - unchanged */}
        <div className="w-[30%] h-[500px] relative flex gap-2 p-2">
          <div className="flex flex-col gap-2 w-3/5">
            {/* Image container */}
            <div className="h-[80%] relative overflow-hidden">
              <Image
                src="/Images/about/about-3.jpg"
                alt="Spacious hostel room"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            {/* Gradient block */}
            <div className="h-[30%] w-full bg-gradient-to-r from-[#FFE5D9] to-[#BDE0FF] opacity-75" />
          </div>

          <div className="flex flex-col gap-2 w-1/4">
            <div className="h-[10%] w-full bg-gradient-to-r from-[#FFE5D9] to-[#BDE0FF] opacity-75" />
            <div className="h-[90%] relative overflow-hidden">
              <Image
                src="/Images/about/about-1.jpg"
                alt="Spacious hostel room"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 20vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional decorative element */}
      <div className="absolute top-1/2 right-12 w-24 h-24 bg-gradient-to-br from-[#FFE5D9] to-[#BDE0FF] rounded-lg rotate-45 -z-10 opacity-80" />
    </div>
  );
};

export default HostelBanner;
