"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ConnectionCheckPage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds countdown
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const timeout = 10000; // 10 seconds timeout
    let timeoutId: NodeJS.Timeout;
    let countdownId: NodeJS.Timeout;

    // Start countdown
    countdownId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(10 - elapsed, 0);
      setTimeLeft(remaining);

      if (remaining === 0) {
        setIsRedirecting(true);
        router.push("/Maintenance");
      }
    }, 1000);

    // Start connection check

    // Cleanup
    return () => {
      clearInterval(countdownId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        <div className="relative mb-6">
          {/* Progress circle */}
          <motion.div
            className="w-24 h-24 mx-auto border-4 border-gray-200 rounded-full"
            style={{ borderTopColor: "#4F46E5" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Countdown number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-gray-700">
              {timeLeft}s
            </span>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Checking Connection
        </h2>

        <p className="text-gray-600 mb-6">
          Please wait while we verify the connection to our servers...
        </p>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className="bg-indigo-600 h-2 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </div>

        <p className="text-sm text-gray-500">
          {isRedirecting
            ? "Connection failed. Redirecting to maintenance page..."
            : "This may take a few moments..."}
        </p>
      </motion.div>
    </div>
  );
};

export default ConnectionCheckPage;
