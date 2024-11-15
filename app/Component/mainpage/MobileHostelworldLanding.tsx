import React, { useState, useCallback, useMemo } from "react";
import { Search, ArrowRight } from "lucide-react";
import Image from "next/image";

interface MobileHostelworldLandingProps {
  onSearch: (query: string, location: string) => void;
}

const MobileHostelworldLanding: React.FC<MobileHostelworldLandingProps> = ({
  onSearch,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize images array to prevent recreation on each render
  const images = useMemo(
    () => [
      "/Images/banner/about-1.jpg",
      "/Images/banner/about-2.jpg",
      "/Images/banner/about-3.jpg",
    ],
    []
  );

  // Use requestAnimationFrame for smoother image transitions
  React.useEffect(() => {
    let rafId: number;
    let lastUpdate = 0;
    const interval = 3000; // 3 seconds

    const updateImage = (timestamp: number) => {
      if (timestamp - lastUpdate >= interval) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        lastUpdate = timestamp;
      }
      rafId = requestAnimationFrame(updateImage);
    };

    rafId = requestAnimationFrame(updateImage);
    return () => cancelAnimationFrame(rafId);
  }, [images.length]);

  // Memoize the search handler
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchQuery, "");
    },
    [searchQuery, onSearch]
  );

  // Memoize the input change handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
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
              src="/Images/about/m.png"
              alt="Person"
              width={300}
              height={300}
              className="h-[120px] xs:h-[140px] sm:h-[200px] md:h-[250px] w-auto object-contain opacity-90 drop-shadow-lg transition-all duration-300"
              priority
              loading="eager"
              quality={75}
            />
          </div>

          {/* Background Logo */}
          <div className="absolute inset-0 z-10">
            <div className="relative h-full flex items-center">
              <div className="absolute left-0 w-full sm:w-auto pl-2 xs:pl-4 sm:pl-[8%] transform-gpu">
                <Image
                  src="/builddemo.png"
                  alt="Background"
                  width={550}
                  height={550}
                  className="w-[280px] xs:w-[320px] sm:w-[450px] md:w-[550px] h-auto object-contain opacity-75 transform-gpu transition-transform duration-300"
                  style={{
                    mixBlendMode: "overlay",
                    filter: "brightness(1.2) contrast(1.1)",
                    transform: "scale(1.2) translateX(-8%)",
                  }}
                  priority
                  loading="eager"
                  quality={75}
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="absolute w-full mt-[4%] sm:mt-[6%] md:mt-[8%] z-20 flex flex-col items-center px-4">
            <div className="space-y-4 sm:space-y-8 text-center relative">
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-white font-bold leading-tight drop-shadow-lg whitespace-normal sm:whitespace-nowrap relative z-10">
                Welcome to Latur Hostel
              </h1>
              <p className="font-serif text-sm sm:text-base lg:text-xl text-white/90 italic drop-shadow-lg">
                Find Your Home, away from Home
              </p>
            </div>
          </div>

          {/* Background Gradients */}
          <div className="absolute inset-0 flex">
            {/* Left gradient section */}
            <div className="relative w-[45%] flex items-center bg-gradient-to-r from-[#FF8C42] via-[#5BB5E6] to-[#3A9BD8]">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3A9BD8]/30 to-[#3A9BD8]" />{" "}
              {/* Removed /70 opacity */}
            </div>

            {/* Right section */}
            <div className="relative w-[55%]">
              <div className="absolute inset-0 z-10">
                {/* Adjusted the leftmost gradient to start exactly at edge */}
                <div className="absolute -left-px top-0 h-full w-[150px] sm:w-[250px] bg-gradient-to-r from-[#3A9BD8] via-[#3A9BD8]/70 to-transparent" />
                <div className="absolute left-[50px] sm:left-[100px] top-0 h-full w-[100px] sm:w-[200px] bg-gradient-to-r from-[#3A9BD8]/40 via-[#3A9BD8]/20 to-transparent" />
                <div className="absolute left-[100px] sm:left-[200px] top-0 h-full w-[75px] sm:w-[150px] bg-gradient-to-r from-[#3A9BD8]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
              </div>

              {/* Image Carousel */}
              <div className="absolute inset-0">
                <Image
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt={`Carousel image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-1000 ease-in-out"
                  priority={currentImageIndex === 0}
                  loading={currentImageIndex === 0 ? "eager" : "lazy"}
                  quality={75}
                />
              </div>
              <div className="absolute inset-0 bg-black/10" />
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
                  onChange={handleSearchChange}
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

export default React.memo(MobileHostelworldLanding);
