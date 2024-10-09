import React from "react";
import { motion } from "framer-motion";

interface WavePromoBannerProps {
  text: string;
}

const WavePromoBanner: React.FC<WavePromoBannerProps> = ({ text }) => {
  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-r from-sky-400 to-sky-500 rounded-3xl"
      style={{ height: "clamp(35px, 6vw, 60px)" }}
    >
      {/* Top wave */}
      <motion.div
        className="absolute top-0 left-0 w-full"
        style={{ height: "clamp(20px, 5vw, 40px)" }}
        animate={{
          x: [0, -100, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="rgba(255,255,255,0.3)"
          ></path>
        </svg>
      </motion.div>

      {/* Bottom wave */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "clamp(20px, 5vw, 40px)" }}
        animate={{
          x: [0, 100, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: "linear",
        }}
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="rgba(255,255,255,0.3)"
          ></path>
        </svg>
      </motion.div>

      {/* Text container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="text-white font-bold whitespace-nowrap px-4"
          style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.5rem)" }}
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {text}
        </motion.div>
      </div>

      {/* Shimmering effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-10"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default WavePromoBanner;
