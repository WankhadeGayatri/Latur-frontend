import React, { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface SmartScrollIndicatorProps {
  listRef: RefObject<HTMLDivElement | null>;
  threshold?: number;
}

const ScrollIndicator: React.FC<SmartScrollIndicatorProps> = ({
  listRef,
  threshold = 50, // Reduced threshold
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      if (listRef?.current) {
        const { scrollHeight, clientHeight } = listRef.current;

        // Show indicator if content is slightly larger than container
        const isScrollable = scrollHeight > clientHeight + threshold;
        setIsVisible(isScrollable);
      }
    };

    // Check initial scrollability
    checkScrollability();

    // Re-check on window resize
    window.addEventListener("resize", checkScrollability);

    // Check after a short delay to account for dynamic content
    const timer = setTimeout(checkScrollability, 500);

    return () => {
      window.removeEventListener("resize", checkScrollability);
      clearTimeout(timer);
    };
  }, [listRef, threshold]);

  const handleScrollClick = () => {
    if (listRef?.current) {
      const { scrollHeight, clientHeight } = listRef.current;

      // Scroll to bottom
      listRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  };

  // Don't render if no ref
  if (!listRef?.current) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            },
          }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-50 cursor-pointer group"
          onClick={handleScrollClick}
        >
          <div className="relative">
            {/* Animated Gradient Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-70 blur-lg group-hover:opacity-90 transition-all duration-300"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />

            {/* Foreground Button */}
            <div className="relative bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-all">
              <ChevronDown
                className="text-blue-600 group-hover:text-blue-800 transition-colors"
                size={24}
                strokeWidth={2.5}
              />
            </div>

            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Scroll to Bottom
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollIndicator;
