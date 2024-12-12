import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock time service to simulate server-side time
class TimeService {
  // Simulate server time with slight variations
  static async getServerTime(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Randomly decide between success and failure
        if (Math.random() > 0.1) {
          // 90% success rate
          const serverTime = new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          resolve(serverTime);
        } else {
          reject(new Error("Network error"));
        }
      }, 500); // 500ms delay to simulate network request
    });
  }
}

const TimeDisplay: React.FC = () => {
  const [timeState, setTimeState] = useState({
    current: new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    }),
    previous: null as string | null,
    error: null as string | null,
  });

  const syncTime = useCallback(async () => {
    try {
      // Use mock time service
      const serverTime = await TimeService.getServerTime();

      setTimeState((prev) => ({
        current: serverTime,
        previous: prev.current,
        error: null,
      }));
    } catch (error) {
      // Handle synchronization errors
      setTimeState((prev) => ({
        current: prev.current,
        previous: null,
        error: "Time sync failed. Using local time.",
      }));
    }
  }, []);

  useEffect(() => {
    // Initial sync
    syncTime();

    // Periodic sync every 5 seconds
    const timer = setInterval(syncTime, 5000);

    // Cleanup interval
    return () => clearInterval(timer);
  }, [syncTime]);

  return (
    <div className="relative h-6 overflow-hidden">
      <AnimatePresence>
        {timeState.previous && (
          <motion.span
            key="previous-time"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 text-[10px] sm:text-xs font-semibold text-gray-400"
          >
            {timeState.previous}
          </motion.span>
        )}

        <motion.span
          key="current-time"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-0 text-[10px] sm:text-xs font-semibold"
        >
          {timeState.current}
        </motion.span>
      </AnimatePresence>

      {timeState.error && (
        <div className="text-red-500 text-xs mt-1">{timeState.error}</div>
      )}
    </div>
  );
};

export default TimeDisplay;
