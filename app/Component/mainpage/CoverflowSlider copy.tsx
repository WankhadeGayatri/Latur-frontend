import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
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

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex items-center space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-400"
        }`}
      />
    ))}
  </div>
));
StarRating.displayName = "StarRating";

const SliderCard = memo(
  ({
    item,
    style,
    isActive,
  }: {
    item: SliderItem;
    style: React.CSSProperties;
    isActive: boolean;
  }) => (
    <div className="absolute top-1 -translate-y-1/2" style={style}>
      <div
        className={`bg-white rounded-xl overflow-hidden transition-all duration-500 cursor-pointer
          ${
            isActive
              ? "shadow-2xl ring-2 ring-blue-500"
              : "shadow-lg hover:shadow-xl"
          }
        `}
      >
        <div className="relative w-full aspect-square">
          <img
            src={item.src}
            alt={item.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <h3
                className={`font-bold mb-2 truncate ${
                  isActive ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                }`}
              >
                {item.name}
              </h3>
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <StarRating rating={item.rating} />
                  <span
                    className={`${
                      isActive ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                    }`}
                  >
                    {item.rating.toFixed(1)}
                  </span>
                </div>
                <span
                  className={`font-bold whitespace-nowrap ${
                    isActive ? "text-lg sm:text-xl" : "text-sm sm:text-base"
                  }`}
                >
                  ₹{item.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);
SliderCard.displayName = "SliderCard";

const CoverflowSlider: React.FC<CoverflowSliderProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Optimized resize handler with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (!isPaused) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }
  }, [items.length, isPaused]);

  const prevSlide = useCallback(() => {
    if (!isPaused) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + items.length) % items.length
      );
    }
  }, [items.length, isPaused]);

  // Optimized autoplay with RAF
  useEffect(() => {
    if (!isAutoPlay || isPaused) return;

    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= 3000) {
        nextSlide();
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoPlay, nextSlide, isPaused]);

  const getItemStyle = useCallback(
    (position: number, isActive: boolean) => {
      const totalItems = isMobile ? 3 : 7;
      const itemWidth = isMobile ? 80 : 20;
      const overlap = 25;
      const effectiveWidth = itemWidth * (1 - overlap / 100);
      const basePosition = 100 - itemWidth;
      const offset = position * effectiveWidth;
      const xPos = basePosition - offset;

      return {
        position: "absolute",
        right: `${xPos}%`,
        width: `${itemWidth}%`,
        zIndex: isActive
          ? totalItems
          : totalItems - Math.abs(position - Math.floor(totalItems / 2)),
        transform: `scale(${isActive ? 1 : 0.85})`,
        transition: "all 0.5s ease-out",
        willChange: "transform, right",
      } as React.CSSProperties;
    },
    [isMobile]
  );

  const visibleItems = useMemo(() => {
    const visibleCount = isMobile ? 3 : 7;
    const result = [];
    const offset = Math.floor(visibleCount / 2);

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex - offset + i + items.length) % items.length;
      result.push({
        item: items[index],
        position: i,
        isActive: i === offset,
      });
    }

    return result;
  }, [currentIndex, items.length, isMobile]);

  return (
    <div
      className="relative  h-[700px]  bg-gray-50 overflow-hidden"
      onMouseEnter={() => {
        setIsAutoPlay(false);
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        setIsAutoPlay(true);
        setIsPaused(false);
      }}
    >
      <div className="relative h-full w-full ">
        {visibleItems.map(({ item, position, isActive }, index) => (
          <SliderCard
            key={`${item.name}-${position}`}
            item={item}
            style={getItemStyle(position, isActive)}
            isActive={isActive}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(CoverflowSlider);
