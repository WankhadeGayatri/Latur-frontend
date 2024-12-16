import React, { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";

// Placeholder shimmer component with Tailwind animation
const ShimmerEffect = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
));

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

    // Pre-calculate image dimensions to prevent layout shift
    const aspectRatio = "aspect-square";
    const baseWidth = 320;
    const baseHeight = 320;

    return (
      <div
        className={`
        relative
        w-80
        ${aspectRatio}
        bg-muted
        rounded-lg
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
          className="absolute inset-0 bg-muted/50"
          style={{ aspectRatio: "1/1" }}
        >
          {!isLoaded && <ShimmerEffect />}
        </div>

        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`
            object-cover 
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
            onLoadingComplete={() => setIsLoaded(true)}
            onError={() => {
              setIsLoaded(false);
              setError(true);
            }}
          />

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <p className="text-destructive">Image failed to load</p>
            </div>
          )}

          {/* Content overlay with fixed dimensions */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="relative h-full">
              <h2 className="text-[28px] font-bold text-white mb-2 truncate">
                {name}
              </h2>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-white/90">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

OptimizedCard.displayName = "OptimizedCard";

const InfiniteCardCarousel = ({
  items,
}: {
  items: Array<{
    src: string;
    alt: string;
    name: string;
    price: number;
    rating: number;
  }>;
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  // Create an extended array with more repetitions for smoother infinite scrolling
  const extendedItems = [
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
    ...items,
  ];

  const cardWidth = 320; // w-80
  const cardGap = 16; // gap-4
  const itemWidth = cardWidth + cardGap;

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

  // Improved auto-scroll with smoother transition
  useEffect(() => {
    if (!isAutoScrolling) return;

    const autoScrollInterval = setInterval(() => {
      handleScroll("next");
    }, 3000);

    return () => clearInterval(autoScrollInterval);
  }, [isAutoScrolling, handleScroll]);

  return (
    <div className="relative w-full bg-background py-8">
      <div className="max-w-[90rem] mx-auto px-4 relative isolate">
        {/* Navigation buttons with adjusted z-index */}
        <div className="absolute inset-0 pointer-events-none z-[5]">
          <button
            onClick={() => handleScroll("prev")}
            className="absolute left-4 top-1/2 -translate-y-1/2 
                     bg-white/90 backdrop-blur-sm rounded-full p-2
                     shadow-lg hover:bg-primary hover:text-primary-foreground
                     transition-colors pointer-events-auto"
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("next")}
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     bg-white/90 backdrop-blur-sm rounded-full p-2
                     shadow-lg hover:bg-primary hover:text-primary-foreground
                     transition-colors pointer-events-auto"
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        {/* Cards container with responsive width */}
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

export default memo(InfiniteCardCarousel);
