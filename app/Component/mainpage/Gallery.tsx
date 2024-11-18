"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Gallery = () => {
  const images = [
    { src: "/Images/HomePage/dining.jpg", alt: "Dinning Room" },
    { src: "/Images/HomePage/room.jpg", alt: "Hostel Rooms" },
    { src: "/Images/about/about-2.jpg", alt: " Rooms" },
    { src: "/Images/HomePage/study.jpg", alt: "Study Rooms" },
    { src: "/Images/HomePage/hall.jpg", alt: "Hall" },
    { src: "/Images/about/about-1.jpg", alt: "Attached bed" },
    { src: "/Images/HomePage/single2.jpg", alt: "single room" },

    { src: "/Images/HomePage/room.jpg", alt: "Rooms" },

    { src: "/Images/about/about-2.jpg", alt: "combine room" },
    { src: "/Images/HomePage/room.jpg", alt: "Hostel Rooms" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Featured large item */}
          <div className="col-span-1 sm:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl shadow-lg group h-64 sm:h-auto">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Featured Image
                </h3>
                <p className="text-white/90 text-sm sm:text-base">
                  {images[0].alt}
                </p>
              </div>
            </div>
          </div>

          {/* Grid items */}
          {images.slice(1, 8).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group h-48"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-lg sm:text-xl font-bold text-white">
                    {image.alt}
                  </h4>
                </div>
              </div>
            </div>
          ))}

          {/* View More Card - Always visible */}
          <Link
            href="/gallery"
            className="relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 h-48 group"
          >
            {/* Content wrapper */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
              <div className="text-center z-10">
                <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  View More
                </h4>
                <p className="text-white/90 text-sm sm:text-base mb-3">
                  Discover our complete collection
                </p>
                <div className="inline-flex items-center text-white text-sm sm:text-base bg-white/10 px-4 py-2 rounded-full">
                  <span className="mr-2">Explore Gallery</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0">
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl transform rotate-45"></div>
              <div className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
