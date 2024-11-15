import React, { useState, useEffect, useMemo } from "react";
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Memoize images array to prevent unnecessary re-renders
  const images = useMemo(
    () => [
      "/Images/banner/about-1.jpg",
      "/Images/banner/about-2.jpg",
      "/Images/banner/about-3.jpg",
    ],
    []
  );

  // Preload images using a React-friendly approach
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = images.length;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const imageElement = document.createElement("link");
        imageElement.rel = "preload";
        imageElement.as = "image";
        imageElement.href = src;

        imageElement.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve(true);
        };

        imageElement.onerror = reject;
        document.head.appendChild(imageElement);
      });
    };

    // Preload all images
    const preloadAll = async () => {
      try {
        await Promise.all(images.map((src) => preloadImage(src)));
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadAll();

    // Cleanup function
    return () => {
      const preloadLinks = document.head.querySelectorAll(
        'link[rel="preload"][as="image"]'
      );
      preloadLinks.forEach((link) => {
        document.head.removeChild(link);
      });
    };
  }, [images]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, "");
  };

  return (
    <div className="relative">
      <div className="w-full relative">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:h-[430px]">
          {/* Person Images */}
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
              loading="lazy"
              quality={75}
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
              loading="lazy"
              quality={75}
            />
          </div>

          {/* Background Logo */}

          {/* Text Content */}
          <div className="absolute w-full mt-[8%] sm:mt-[6%] md:mt-[8%] z-20 flex flex-col items-center px-4">
            <div className="space-y-2 sm:space-y-8 text-center relative">
              <h1 className="font-serif text-xl sm:text-4xl lg:text-6xl text-white font-bold leading-tight drop-shadow-lg break-words sm:whitespace-nowrap relative z-10">
                Welcome to Latur Hostel
              </h1>
              <p className="font-serif text-sm sm:text-base lg:text-xl text-white/90 italic drop-shadow-lg">
                Find Your Home, away from Home
              </p>
            </div>
          </div>

          {/* Background Gradients */}
          <div className="absolute inset-0 flex">
            <div className="relative w-[45%] bg-gradient-to-r from-[#FF8C42] via-[#5BB5E6] to-[#3A9BD8]">
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent" />
            </div>

            <div className="relative w-[55%]">
              <div className="absolute inset-0 z-10">
                <div className="absolute left-0 top-0 h-full w-[150px] sm:w-[250px] bg-gradient-to-r from-[#3A9BD8] to-transparent" />
              </div>

              {/* Image Carousel */}
              <div className="absolute inset-0">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Carousel image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 55vw"
                      className="object-cover"
                      priority={index === 0}
                      quality={75}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[92%] md:w-1/2 z-40">
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
                  className="w-full bg-transparent text-black text-sm sm:text-lg py-2 sm:py-4 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-3 sm:px-10 py-2 sm:py-4 rounded-lg flex items-center justify-center whitespace-nowrap text-sm sm:text-lg font-semibold"
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
