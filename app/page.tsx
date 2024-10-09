"use client";
import React, { Suspense, useState, useEffect } from "react";
import { Typography, Container } from "@mui/material";
import dynamic from "next/dynamic";
import Navbar from "./Component/mainpage/Navbar";
import Lottie from "lottie-react";
import handAnimation from "../public/Animation.json";
import wait from "../public/wait.json";

const DynamicHomePageContent = dynamic(
  () => import("./Component/mainpage/HomePageContent"),
  { loading: () => null, ssr: false }
);

const GradientBubbles = () => (
  <div className="absolute inset-0 overflow-hidden">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient
          id="gradient1"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="rgba(255, 99, 132, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 99, 132, 0)" />
        </radialGradient>
        <radialGradient
          id="gradient2"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="rgba(75, 192, 192, 0.8)" />
          <stop offset="100%" stopColor="rgba(75, 192, 192, 0)" />
        </radialGradient>
        <radialGradient
          id="gradient3"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="rgba(255, 206, 86, 0.8)" />
          <stop offset="100%" stopColor="rgba(255, 206, 86, 0)" />
        </radialGradient>
      </defs>
      <circle
        className="animate-float1"
        cx="20%"
        cy="30%"
        r="25%"
        fill="url(#gradient1)"
      />
      <circle
        className="animate-float2"
        cx="80%"
        cy="60%"
        r="20%"
        fill="url(#gradient2)"
      />
      <circle
        className="animate-float3"
        cx="50%"
        cy="80%"
        r="30%"
        fill="url(#gradient3)"
      />
    </svg>
  </div>
);

const WelcomeAnimation = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-sky-800 via-sky-600 to-sky-400 overflow-hidden">
    <style jsx>{`
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes float1 {
        0%,
        100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(30px, 30px);
        }
      }
      @keyframes float2 {
        0%,
        100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(-30px, 30px);
        }
      }
      @keyframes float3 {
        0%,
        100% {
          transform: translate(0, 0);
        }
        50% {
          transform: translate(30px, -30px);
        }
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      .animate-float1 {
        animation: float1 20s infinite ease-in-out;
      }
      .animate-float2 {
        animation: float2 25s infinite ease-in-out;
      }
      .animate-float3 {
        animation: float3 22s infinite ease-in-out;
      }
      .text-shadow {
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
    `}</style>
    <GradientBubbles />
    <div className="text-center z-10 relative">
      <div
        className="w-64 h-64 mx-auto mb-8 animate-fadeInUp"
        style={{ animationDelay: "0.2s" }}
      >
        <Lottie animationData={handAnimation} loop={true} autoplay={true} />
      </div>
      <h1
        className="text-5xl font-bold mb-4 text-white text-shadow animate-fadeInUp"
        style={{ animationDelay: "0.5s" }}
      >
        Welcome to Latur Hostel
      </h1>
      <p
        className="text-xl text-sky-100 animate-fadeInUp"
        style={{ animationDelay: "0.7s" }}
      >
        Your Home Away From Home
      </p>
    </div>
  </div>
);

const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-sky-800/80 z-40">
    <div className="w-24 h-24">
      <Lottie animationData={wait} loop={true} autoplay={true} />
    </div>
  </div>
);

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-r from-sky-50 to-white">
      <Container maxWidth={false} className="px-2 relative z-10">
        <Navbar />
        <Suspense fallback={<LoadingOverlay />}>
          <DynamicHomePageContent />
        </Suspense>
      </Container>
      {isLoading && <WelcomeAnimation />}
    </div>
  );
};

export default HomePage;
