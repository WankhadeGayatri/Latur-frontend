import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface SliderItem {
  src: string;
  alt: string;
  name: string;
  price: number;
  rating: number;
}

interface CoverflowSliderProps {
  items: SliderItem[];
}

const CoverflowSlider: React.FC<CoverflowSliderProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  }, [items.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 2000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-white">
      <div className="flex items-center justify-center h-full">
        {items.map((item, index) => {
          const offset = index - currentIndex;
          const wrappedOffset =
            ((offset + items.length) % items.length) - items.length / 2;
          const absOffset = Math.abs(wrappedOffset);
          const isActive = wrappedOffset === 0;

          return (
            <div
              key={index}
              className={`absolute transition-all duration-700 ease-in-out ${
                isActive ? "z-10" : "z-0"
              }`}
              style={
                {
                  "--translateX": `${wrappedOffset * 50}%`,
                  "--scale": `${1 - absOffset * 0.1}`,
                  "--rotateY": `${-Math.abs(wrappedOffset) * 5}deg`,
                  "--opacity": `${1 - absOffset * 0.05}`,
                  transform:
                    "translateX(var(--translateX)) scale(var(--scale)) rotateY(var(--rotateY))",
                  opacity: "var(--opacity)",
                } as React.CSSProperties
              }
            >
              <div
                className={`w-40 xs:w-48 sm:w-56 md:w-64 lg:w-80 bg-white rounded-xl overflow-hidden transition-all duration-500 ${
                  isActive ? "ring-1 ring-blue-400 shadow-3xl" : "shadow-lg"
                }`}
              >
                <div className="relative w-full h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-2 xs:p-3 sm:p-4 text-white">
                      <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 truncate">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                                i < item.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs xs:text-sm sm:text-base md:text-xl font-bold">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-1 xs:bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-1 xs:space-x-2 sm:space-x-4">
        <button
          onClick={prevSlide}
          className="bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <ChevronLeft className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <div className="flex space-x-1 sm:space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gray-500 w-3 xs:w-4 sm:w-6"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <ChevronRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-6 sm:h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CoverflowSlider;
