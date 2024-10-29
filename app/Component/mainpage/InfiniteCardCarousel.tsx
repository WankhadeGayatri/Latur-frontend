import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, ArrowRight, ArrowLeft } from "lucide-react";

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

    return (
      <div
        className={`
          relative
          w-80 h-80
          bg-white
          rounded-2xl
          overflow-hidden
          transition-all duration-500 ease-out
          group
          hover:shadow-[0_0_40px_rgba(124,58,237,0.5)]
          hover:scale-105
          hover:z-20
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
      >
        {/* Animated border effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 opacity-0 group-hover:opacity-100 animate-gradient-xy" />
        <div className="absolute inset-[2px] bg-white rounded-2xl overflow-hidden">
          <picture>
            <source
              type="image/avif"
              srcSet={`${src}?w=320&fmt=avif 320w, ${src}?w=480&fmt=avif 480w`}
            />
            <source
              type="image/webp"
              srcSet={`${src}?w=320&fmt=webp 320w, ${src}?w=480&fmt=webp 480w`}
            />
            <img
              src={src}
              alt={alt}
              loading={index < 5 ? "eager" : "lazy"}
              decoding="async"
              className={`
                w-full h-48
                object-cover
                transition-all duration-700
                group-hover:scale-110
                ${isLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/Images/placeholder.avif";
              }}
            />
          </picture>

          {/* Content overlay with hover animations */}
          <div className="p-4 relative">
            <div
              className="absolute -top-8 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 
                          shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 
                          group-hover:translate-y-0 transition-all duration-500"
            >
              <span className="text-xl font-bold text-purple-600">
                ₹{price}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-2 truncate transform group-hover:-translate-y-1 transition-transform duration-300">
              {name}
            </h3>

            <div className="flex items-center space-x-1 transform group-hover:-translate-y-1 transition-transform duration-300 delay-75">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    i < rating
                      ? "text-yellow-400 fill-current group-hover:scale-110"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Hover reveal button */}
            <button
              className="
              absolute bottom-4 right-4
              bg-purple-600 text-white
              px-4 py-2 rounded-full
              transform translate-y-12 opacity-0
              group-hover:translate-y-0 group-hover:opacity-100
              transition-all duration-500 ease-out
              hover:bg-purple-700
              flex items-center gap-2
            "
            >
              View Details
              <ArrowRight className="w-4 h-4 animate-bounceX" />
            </button>
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
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Triple the items for infinite scroll effect
  const extendedItems = [...items, ...items, ...items];
  const itemWidth = 336; // 320px + 16px gap
  const totalWidth = extendedItems.length * itemWidth;

  const handlePrevPage = () => {
    setIsAutoScrolling(false);
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 0);
      setScrollPosition(-newPage * itemWidth);
      return newPage;
    });
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleNextPage = () => {
    setIsAutoScrolling(false);
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, extendedItems.length - 1);
      setScrollPosition(-newPage * itemWidth);
      return newPage;
    });
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoScrolling(false);
    setStartX(e.pageX + scrollPosition);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (startX - x) * 2;
      setScrollPosition(-walk);
    },
    [isDragging, startX]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    const page = Math.round(-scrollPosition / itemWidth);
    setCurrentPage(page);
    setScrollPosition(-page * itemWidth);
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const next = (prev + 1) % extendedItems.length;
        setScrollPosition(-next * itemWidth);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, extendedItems.length, itemWidth]);

  return (
    <div className="relative w-full bg-gray-50 py-12 overflow-hidden">
      {/* Navigation buttons */}
      <button
        onClick={handlePrevPage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30
                 bg-white/90 backdrop-blur-sm rounded-full p-3
                 shadow-lg hover:bg-purple-600 hover:text-white
                 transition-all duration-300 group"
        aria-label="Previous page"
      >
        <ArrowLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={handleNextPage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30
                 bg-white/90 backdrop-blur-sm rounded-full p-3
                 shadow-lg hover:bg-purple-600 hover:text-white
                 transition-all duration-300 group"
        aria-label="Next page"
      >
        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Cards container */}
      <div
        className={`
          flex gap-4
          transition-transform duration-500 ease-out
          ${isDragging ? "cursor-grabbing scale-[0.98]" : "cursor-grab"}
        `}
        style={{
          transform: `translateX(${scrollPosition}px)`,
          width: `${totalWidth}px`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {extendedItems.map((item, index) => (
          <OptimizedCard
            key={`${item.name}-${index}`}
            {...item}
            index={index}
            isVisible={Math.abs(index - currentPage) < 5}
          />
        ))}
      </div>

      {/* Edge gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default memo(InfiniteCardCarousel);
