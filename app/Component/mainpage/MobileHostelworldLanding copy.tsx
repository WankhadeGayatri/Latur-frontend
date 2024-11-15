import React, { useState, useEffect } from "react";
import { Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface MobileHostelworldLandingProps {
  onSearch: (query: string, location: string) => void;
}

const MobileHostelworldLanding: React.FC<MobileHostelworldLandingProps> = ({
  onSearch,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const images = [
    "/Images/banner/blur.png",
    "/Images/banner/about-2.jpg",
    "/Images/banner/about-3.jpg",
  ];

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, "");
  };

  // Add these arrow button components
  const SliderArrow = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 z-50 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200 backdrop-blur-sm ${
        direction === "left" ? "left-4" : "right-4"
      }`}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
    >
      {direction === "left" ? (
        <ChevronLeft className="w-6 h-6" />
      ) : (
        <ChevronRight className="w-6 h-6" />
      )}
    </button>
  );

  return (
    <div className="relative">
      <div className="w-full relative">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:h-[430px]">
          {/* Person Image */}
          <div
            className="absolute bottom-0 left-2 sm:left-8 z-30"
            style={{ transform: "translateY(-10%)" }}
          >
            <Image
              src="/Images/about/boybanner1.png"
              alt="Person"
              width={300}
              height={300}
              className="h-[120px] xs:h-[140px] sm:h-[200px] md:h-[250px] w-auto object-contain opacity-90 drop-shadow-lg transition-all duration-300"
              priority
            />
          </div>
          <div
            className="absolute bottom-0 right-2 sm:right-8 z-30"
            style={{ transform: "translateY(-10%)" }}
          >
            <Image
              src="/Images/about/girldemo.png"
              alt="Person"
              width={300}
              height={300}
              className="h-[120px] xs:h-[140px] sm:h-[200px] md:h-[250px] w-auto object-contain opacity-90 drop-shadow-lg transition-all duration-300"
              priority
            />
          </div>

          {/* Background Logo */}
          <div className="absolute inset-0 z-10 flex justify-start items-center pl-[8%] sm:pl-[12%]">
            <Image
              src="/builddemo.png"
              alt="Background"
              width={550}
              height={550}
              className="w-[350px] sm:w-[450px] md:w-[550px] h-auto object-contain opacity-75"
              style={{
                mixBlendMode: "overlay",
                filter: "brightness(1.2) contrast(1.1)",
              }}
              priority
            />
          </div>

          {/* Text Content */}
          <div className="absolute w-full mt-[4%] sm:mt-[6%] md:mt-[8%] z-20 flex flex-col items-center px-4">
            <div className="space-y-4 sm:space-y-8 text-center relative">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-white font-bold leading-tight drop-shadow-lg whitespace-normal sm:whitespace-nowrap relative z-10">
                Welcome to Latur Hostel
              </h1>
              <p className="font-serif text-sm sm:text-base lg:text-xl text-white/90 italic drop-shadow-lg">
                Find your Home, away from Home
              </p>
            </div>
          </div>

          {/* Background Gradients */}
          <div className="absolute inset-0 flex">
            <div className="relative w-[45%] flex items-center bg-gradient-to-r from-[#FF8C42] via-[#5BB5E6] to-[#3A9BD8]">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3A9BD8]/30 to-[#3A9BD8]/70" />
            </div>

            <div className="relative w-[55%] overflow-hidden">
              <div className="absolute inset-0 z-10">
                <div className="absolute left-0 top-0 h-full w-[150px] sm:w-[250px] bg-gradient-to-r from-[#3A9BD8] via-[#3A9BD8]/70 to-transparent" />
                <div className="absolute left-[50px] sm:left-[100px] top-0 h-full w-[100px] sm:w-[200px] bg-gradient-to-r from-[#3A9BD8]/40 via-[#3A9BD8]/20 to-transparent" />
                <div className="absolute left-[100px] sm:left-[200px] top-0 h-full w-[75px] sm:w-[150px] bg-gradient-to-r from-[#3A9BD8]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
              </div>

              {/* Slider Arrows */}
              <SliderArrow direction="left" onClick={prevSlide} />
              <SliderArrow direction="right" onClick={nextSlide} />

              {/* Modified Image Carousel with slide effect */}
              <div
                className="absolute inset-0 flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                  width: `${images.length * 100}%`,
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative w-full h-full"
                    style={{ width: `${100 / images.length}%` }}
                  >
                    <Image
                      src={image}
                      alt={`Carousel image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-black/10" />

              {/* Optional: Add slide indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "bg-white w-4"
                        : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full md:w-1/2 px-4 z-40">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-2 border-2 border-gray-200 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="flex items-center text-gray-500">
                <Search size={16} className="ml-2 sm:ml-3 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search your Hostel"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-black text-base sm:text-lg py-2 sm:py-4 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-4 sm:px-10 py-2 sm:py-4 rounded-lg flex items-center justify-center whitespace-nowrap text-sm sm:text-lg font-semibold"
              >
                Let's go!
                <ArrowRight size={16} className="ml-2 hidden sm:inline" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileHostelworldLanding;
