import React from "react";
import { Button } from "@mui/material";
import { Search, ArrowRight } from "lucide-react";
import ChatBubbles2 from "./ChatBubble2";

const HostelBanner = () => {
  return (
    <div className="w-full px-4 py-2 h-[600px] overflow-hidden">
      <ChatBubbles2 />
      {/* Text and Search Container */}
      <div className="absolute w-full mt-[9%] z-20 px-16">
        {/* Text Content */}
        <div className="space-y-10">
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight drop-shadow-lg whitespace-nowrap text-gray-800">
            Welcome to Latur Hostel
          </h1>

          <div className="flex ml-40 w-full">
            <p className="font-serif text-base lg:text-xl text-gray-700 italic drop-shadow-lg text-center">
              Find Your Home, Away From Home
            </p>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="mt-[120px] relative z-30 w-full max-w-3xl">
          <div className="bg-gradient-to-r from-[#FF8C42] via-[#5BB5E6] to-[#3A9BD8] p-[1px] rounded-lg shadow-lg">
            <div className="bg-white rounded-lg p-2 flex items-center">
              <div className="flex-grow">
                <div className="flex items-center text-gray-500">
                  <Search
                    size={20}
                    className="ml-3 mr-2 flex-shrink-0 text-[#3A9BD8]"
                  />
                  <input
                    type="text"
                    placeholder="Search your Hostel"
                    className="w-full bg-transparent text-black text-lg py-4 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="bg-gradient-to-r from-[#FF8C42] to-[#3A9BD8] text-white px-10 py-4 rounded-lg flex items-center justify-center whitespace-nowrap text-lg font-semibold">
                  Let's go!
                  <ArrowRight size={16} className="ml-2 hidden sm:inline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main row with two columns */}
      <div className="relative h-full flex">
        {/* Left column - plain white */}
        <div className="relative w-[60%] bg-white" />

        {/* Right column - centered image */}
        {/* Right column - centered image */}
        <div className="relative w-[40%] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat h-full w-full"
            style={{
              backgroundImage: `url('/building.jpg')`,
              backgroundPosition: "center center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HostelBanner;
