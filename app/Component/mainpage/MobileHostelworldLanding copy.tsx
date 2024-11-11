import React, { useState } from "react";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";

interface MobileHostelworldLandingProps {
  onSearch: (query: string, location: string) => void;
}

const MobileHostelworldLanding: React.FC<MobileHostelworldLandingProps> = ({
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchQuery, "");
  };

  const bubbles = [
    {
      text: "No Hidden Charges, No brokrage",
      top: "2%",
      right: "76%",
      image: "/Images/HomePage/BubbleNoCharges.webp",
    },
    {
      text: "Boys or Girls? we have space for both",
      top: "70%",
      right: "42%",
      image: "/Images/HomePage/BubbleStudent.webp",
    },
    {
      text: "Hygienic Place & Healthy Food",
      top: "60%",
      right: "70%",
      image: "/Images/HomePage/BubbleHygine.webp",
    },
    {
      text: "No Middleman Involved",
      top: "2%",
      right: "40%",
      image: "/Images/HomePage/BubbleCommunity.webp",
    },
    {
      text: "24*7 Security",
      top: "40%",
      right: "40%",
      image: "/Images/HomePage/BubbleCamera.webp",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="w-full relative overflow-hidden rounded-[20px] sm:rounded-[30px] md:rounded-[40px] lg:rounded-[50px]">
        <Image
          src="/Images/HomePage/pgImage.jpg"
          alt="Hostel"
          width={1500}
          height={1000}
          layout="responsive"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 z-20 text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          {bubbles.map((bubble, index) => (
            <div
              key={index}
              className="absolute hidden sm:block"
              style={{
                top: bubble.top,
                right: bubble.right,
                transform: "scale(0.7)",
                transformOrigin: "top right",
              }}
            >
              <div className="relative">
                <img
                  src={bubble.image}
                  alt="Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-full border-2 border-white"
                />
              </div>
              <div className="mt-1 bg-purple-900 bg-opacity-80 rounded-lg px-2 py-1 text- whitespace-nowrap shadow-lg">
                {bubble.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-30 w-full max-w-[90%] sm:max-w-[95%] md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4 -mt-6 sm:-mt-10 md:-mt-12 lg:-mt-6">
        <div className="bg-white rounded-full p-1 sm:p-2 flex items-center shadow-lg ">
          <div className="flex-grow">
            <div className="flex items-center text-gray-500 ">
              <Search
                size={20}
                className="ml-2 sm:ml-3 mr-1 sm:mr-2 flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search your Hostel"
                className="w-full bg-transparent  text-black text-sm sm:text-base lg:text-lg py-2 sm:py-3 focus:outline-none focus:border-sky-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 rounded-full flex items-center justify-center whitespace-nowrap text-sm sm:text-base lg:text-lg font-semibold"
            >
              Let's go!{" "}
              <ArrowRight size={16} className="ml-1 sm:ml-2 hidden sm:inline" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHostelworldLanding;
