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
    {
      src: "/Images/HomePage/single2.jpg",
      alt: "single room",
    },
    { src: "/Images/HomePage/room.jpg", alt: "Rooms" },
    { src: "/Images/about/about-2.jpg", alt: "combine room" },
  ];

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Featured large item */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-2xl shadow-lg group">
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">
                  Featured Image
                </h3>
                <p className="text-white/90">{images[0].alt}</p>
              </div>
            </div>
          </div>

          {/* Small items */}
          {images.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-xl font-bold text-white">{image.alt}</h4>
                </div>
              </div>
            </div>
          ))}

          {/* Medium items */}
          {images.slice(3, 5).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-xl font-bold text-white">{image.alt}</h4>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom items with last item as View More */}
          {images.slice(5, -1).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-lg group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-xl font-bold text-white">{image.alt}</h4>
                </div>
              </div>
            </div>
          ))}

          {/* View More Card */}
          <Link
            href="/gallery"
            className="group relative overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-purple-600"
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-2">
                  View More
                </h4>
                <p className="text-white/90 mb-4">
                  Discover our complete collection
                </p>
                <div className="inline-flex items-center text-white">
                  <span className="mr-2">Explore Gallery</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl transform rotate-45"></div>
            <div className="absolute -left-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
