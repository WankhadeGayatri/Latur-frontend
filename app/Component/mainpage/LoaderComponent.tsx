"use client";
import React, { useEffect, useState } from "react";
import { Home, Loader } from "lucide-react";

interface LoaderState {
  dots: string;
}

type AnimationDelay = "0ms" | "150ms" | "300ms";

interface DotProps {
  delay: AnimationDelay;
}

const AnimatedDot: React.FC<DotProps> = ({ delay }: DotProps): JSX.Element => (
  <div
    className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"
    style={{ animationDelay: delay }}
  />
);

const LoaderComponent: React.FC = (): JSX.Element => {
  const [state, setState] = useState<LoaderState>({ dots: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev: LoaderState) => ({
        dots: prev.dots.length >= 3 ? "" : prev.dots + ".",
      }));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-4 w-full flex justify-center">
      <div className="bg-white px-6 py-3 rounded-lg shadow-md flex items-center space-x-4 max-w-md">
        <div className="relative flex-shrink-0">
          <Home
            className="w-6 h-6 text-purple-600 animate-bounce"
            aria-hidden="true"
          />
          <Loader
            className="w-4 h-4 text-blue-500 absolute -right-1 -bottom-1 animate-spin"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-medium text-gray-800 whitespace-nowrap">
            Searching Hostels{state.dots}
          </h2>

          <div
            className="flex space-x-1"
            role="status"
            aria-label="Loading indicator"
          >
            <AnimatedDot delay="0ms" />
            <AnimatedDot delay="150ms" />
            <AnimatedDot delay="300ms" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderComponent;
