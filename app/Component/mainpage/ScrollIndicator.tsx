import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"bottom" | "top">(
    "bottom"
  );
  const [isMobile, setIsMobile] = useState(false);

  const checkScrollPosition = useCallback(() => {
    // Calculate scroll progress for entire document
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = docHeight - windowHeight;

    // Check mobile screen size
    setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed

    // Determine visibility and direction
    if (scrollableDistance > 50) {
      setIsVisible(true);

      // Determine scroll direction
      if (scrollTop + windowHeight >= docHeight - 50) {
        setScrollDirection("top");
      } else if (scrollTop <= 50) {
        setScrollDirection("bottom");
      } else {
        setScrollDirection("bottom");
      }
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkScrollPosition();

    // Add event listeners
    window.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    // Delayed check for dynamic content
    const timer = setTimeout(checkScrollPosition, 500);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      clearTimeout(timer);
    };
  }, [checkScrollPosition]);

  const handleScrollClick = () => {
    if (scrollDirection === "bottom") {
      // Scroll to bottom
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
        }}
        className={`fixed z-40 ${
          isMobile
            ? "bottom-4 right-4" // Adjusted for mobile
            : "bottom-8 right-8" // Original desktop positioning
        }`}
      >
        <div className="relative" onClick={handleScrollClick}>
          {/* Background Gradient */}
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
          <div className="relative bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 transition-all cursor-pointer">
            {scrollDirection === "bottom" ? (
              <ChevronDown
                className="text-blue-600 group-hover:text-blue-800 transition-colors"
                size={20}
                strokeWidth={2.5}
              />
            ) : (
              <ChevronUp
                className="text-blue-600 group-hover:text-blue-800 transition-colors"
                size={20}
                strokeWidth={2.5}
              />
            )}
          </div>

          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {scrollDirection === "bottom"
              ? "Scroll to Bottom"
              : "Scroll to Top"}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScrollIndicator;
