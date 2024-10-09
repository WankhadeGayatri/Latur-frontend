"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface HostelworldLanding {
  onSearch: (query: string, location: string) => void;
}
const HostelworldLanding: React.FC<HostelworldLanding> = ({ onSearch }) => {
  const bubbles = [
    {
      text: "No Hidden Charges, No brokrage",
      top: "5%",
      right: "72%",
      image: "/Images/HomePage/student1.jpeg",
    },

    {
      text: "Boys or Girls? we have space for both",
      top: "70%",
      right: "42%",
      image: "/Images/HomePage/student1.jpeg",
    },
    {
      text: "Hygienic Place & Healthy Food",
      top: "60%",
      right: "70%",
      image: "/Images/HomePage/student1.jpeg",
    },
    {
      text: "No Middleman Involved",
      top: "2%",
      right: "50%",
      image: "/Images/HomePage/student1.jpeg",
    },
    {
      text: "24*7 Security",
      top: "40%",
      right: "40%",
      image: "/Images/HomePage/student1.jpeg",
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const images = [
    { src: "/Images/aspiringstudent.jpg", alt: "Hostel common area" },
    { src: "/Images/Beds.jpg", alt: "Travelers enjoying a meal" },
    { src: "/Images/Buildings.jpg", alt: "City exploration" },
    { src: "/Images/Genralmage1.jpg", alt: "Group activity" },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, []);
  const handleSearch = () => {
    onSearch(searchQuery, "");
  };
  return (
    <div className="relative h-[62vh] overflow-visible">
      {" "}
      {/* Changed to overflow-visible */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 rounded-3xl" // Added rounded corners
        style={{
          backgroundImage: 'url("/Images/HomePage/pgImage.jpeg")',
        }}
      />
      <div className="absolute inset-0 z-10 rounded-3xl" />
      <div className="relative z-20 text-white p-8 h-full flex flex-col justify-between">
        <div className="max-w-xl mt-16">
          <h1 className="text-6xl font-bold mb-4"></h1>
          <p className="text-2xl">
            {/* Choose where to stay and we'll show you who with! */}
          </p>
        </div>

        {bubbles.map((bubble, index) => (
          <div
            key={index}
            className="absolute"
            style={{ top: bubble.top, right: bubble.right }}
          >
            <div className="relative">
              <img
                src={bubble.image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
            <div className="mt-1 bg-purple-900 bg-opacity-80 rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
              {bubble.text}
            </div>
          </div>
        ))}

        {/* {avatars.map((avatar, index) => (
          <div
            key={index}
            className="absolute"
            style={{ top: avatar.top, right: avatar.right }}
          >
            <div className="relative">
              <img
                src={avatar.image}
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>
          </div>
        ))} */}
      </div>
      {/* Repositioned search bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
        <div className="bg-white rounded-full p-2 flex items-center space-x-4 shadow-lg">
          <div className="flex-grow">
            <div className="flex items-center text-gray-500">
              <Search size={24} className="mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search your Hostel"
                className="w-full bg-transparent outline-none text-black text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={handleSearch}
              className="bg-orange-500 text-white px-8 py-4 rounded-full flex items-center whitespace-nowrap text-lg font-semibold"
            >
              Let's go! <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelworldLanding;
