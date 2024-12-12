import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";

// Define the item type
interface HostelItem {
  src: string;
  alt: string;
  name: string;
  price: number;
  rating: number;
}

// Slider items data
const sliderItems: HostelItem[] = [
  {
    src: "/Images/galary/s1.jpeg",
    alt: "Sharda Hostel",
    name: "Sharda Hostel",
    price: 2649,
    rating: 4.3,
  },
  {
    src: "/Images/galary/ami.jpeg",
    alt: "Neha Hostel",
    name: "Neha Hostel",
    price: 2499,
    rating: 4.0,
  },
  {
    src: "/Images/galary/avan.jpeg",
    alt: "Avani Hostel",
    name: "Avani Hostel",
    price: 2799,
    rating: 4.2,
  },
  {
    src: "/Images/galary/b5.png",
    alt: "Sagar Hostel",
    name: "Sagar Hostel",
    price: 2299,
    rating: 3.9,
  },
  {
    src: "/Images/galary/nea.jpeg",
    alt: "Samarth Hostel",
    name: "Samarth Hostel",
    price: 2599,
    rating: 4.1,
  },
  {
    src: "/Images/galary/raman.jpeg",
    alt: "Raman Hostel",
    name: "Raman Hostel",
    price: 2199,
    rating: 3.7,
  },
  {
    src: "/Images/galary/saar.png",
    alt: "Sanichit Hostel",
    name: "Sanichit Hostel",
    price: 2399,
    rating: 4.0,
  },
  {
    src: "/Images/galary/A15.jpg",
    alt: "Shiv Hostel",
    name: "Shiv Hostel",
    price: 2299,
    rating: 3.8,
  },
  {
    src: "/Images/galary/b4.png",
    alt: "Shourya Hostel",
    name: "Shourya Hostel",
    price: 2499,
    rating: 4.1,
  },
  {
    src: "/Images/galary/b.jpeg",
    alt: "Amit Hostel",
    name: "Amit Hostel",
    price: 2199,
    rating: 3.6,
  },
  {
    src: "/Images/galary/b6.png",
    alt: "Venutai Hostel",
    name: "Venutai Hostel",
    price: 2549,
    rating: 4.2,
  },
];

// Shimmer Effect Component
const ShimmerEffect = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
);

// Optimized Card Component
const OptimizedCard = memo(
  ({
    src,
    alt,
    name,
    price,
    rating,
    index,
    isVisible,
  }: {
    src: string;
    alt: string;
    name: string;
    price: number;
    rating: number;
    index: number;
    isVisible: boolean;
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    const aspectRatio = "aspect-square";
    const baseWidth = 320;
    const baseHeight = 320;

    return (
      <div
        className={`
          relative
          w-80 
          ${aspectRatio}
          bg-gray-100
          rounded-xl
          overflow-hidden
          transition-transform duration-300 ease-out
          group
          hover:shadow-lg
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{
          containIntrinsicSize: `${baseWidth}px ${baseHeight}px`,
          contain: "size layout",
        }}
      >
        {/* Placeholder with exact dimensions */}
        <div
          className="absolute inset-0 bg-gray-200"
          style={{ aspectRatio: "1/1" }}
        >
          {!isLoaded && <ShimmerEffect />}
        </div>

        <div className="absolute inset-0">
          <picture>
            <source
              type="image/avif"
              srcSet={`${src}?w=320&fmt=avif 320w, ${src}?w=480&fmt=avif 480w`}
              sizes="320px"
            />
            <source
              type="image/webp"
              srcSet={`${src}?w=320&fmt=webp 320w, ${src}?w=480&fmt=webp 480w`}
              sizes="320px"
            />
            <img
              src={`${src}?w=320&fmt=avif`}
              alt={alt}
              width={baseWidth}
              height={baseHeight}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
              className={`
                w-full h-full
                object-cover
                transition-opacity duration-300
                ${isLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setError(true);
                setIsLoaded(true);
              }}
            />
          </picture>

          {/* Content overlay with fixed dimensions */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="relative h-full">
              <h3 className="text-lg font-bold text-white mb-2 truncate">
                {name}
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-white/90">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-white font-semibold">₹{price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OptimizedCard.displayName = "OptimizedCard";

// Infinite Carousel Component
const InfiniteCardCarousel: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Extend items for infinite scrolling
  const extendedItems = [...sliderItems, ...sliderItems, ...sliderItems];
  const cardWidth = 320; // w-80
  const cardGap = 16; // gap-4

  // Calculate visible cards based on container width
  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Responsive card width calculation
  const getResponsiveCardWidth = () => {
    if (containerWidth < 640) {
      // mobile
      return containerWidth - 32; // Full width minus padding
    }
    return cardWidth;
  };

  const responsiveItemWidth = getResponsiveCardWidth() + cardGap;
  const visibleCards = Math.max(
    1,
    Math.floor(containerWidth / responsiveItemWidth)
  );
  const totalWidth = extendedItems.length * responsiveItemWidth;

  // Handle scrolling
  const handleScroll = useCallback(
    (direction: "prev" | "next") => {
      setIsAutoScrolling(false);
      setCurrentPage((prev) => {
        const delta = direction === "next" ? 1 : -1;
        const newPage =
          (prev + delta + extendedItems.length) % extendedItems.length;
        setScrollPosition(-newPage * responsiveItemWidth);
        return newPage;
      });
      setTimeout(() => setIsAutoScrolling(true), 5000);
    },
    [extendedItems.length, responsiveItemWidth]
  );

  // Auto-scroll effect
  useEffect(() => {
    if (!isAutoScrolling) return;

    let rafId: number;
    let lastTime = performance.now();
    const interval = 3000;

    const animate = (timestamp: number) => {
      if (timestamp - lastTime >= interval) {
        handleScroll("next");
        lastTime = timestamp;
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isAutoScrolling, handleScroll]);

  return (
    <div className="relative w-full bg-white py-8">
      <div className="max-w-[90rem] mx-auto px-4 relative isolate">
        {/* Navigation buttons */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          <button
            onClick={() => handleScroll("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 
                     bg-white/90 backdrop-blur-sm rounded-full p-2
                     shadow-lg hover:bg-purple-600 hover:text-white
                     transition-colors pointer-events-auto"
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     bg-white/90 backdrop-blur-sm rounded-full p-2
                     shadow-lg hover:bg-purple-600 hover:text-white
                     transition-colors pointer-events-auto"
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Cards container */}
        <div
          className="overflow-hidden mx-auto"
          style={{
            height: getResponsiveCardWidth(),
            maxWidth: `${visibleCards * responsiveItemWidth}px`,
          }}
        >
          <div
            className="flex gap-4 transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(${scrollPosition}px)`,
              width: `${totalWidth}px`,
            }}
          >
            {extendedItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                style={{
                  width: getResponsiveCardWidth(),
                  flexShrink: 0,
                }}
              >
                <OptimizedCard
                  {...item}
                  index={index}
                  isVisible={Math.abs(index - currentPage) < visibleCards + 1}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteCardCarousel;
