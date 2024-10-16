"use client";
import React, { Suspense, useState, useEffect, lazy } from "react";
import { Container } from "@mui/material";
import dynamic from "next/dynamic";

const Navbar = lazy(() => import("./Component/mainpage/Navbar"));
const DynamicHomePageContent = dynamic(
  () => import("./Component/mainpage/HomePageContent"),
  { loading: () => <LoadingPlaceholder />, ssr: false }
);

const DynamicLottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div></div>,
});

// Optimized animations
import handAnimation from "../public/Animation.json";
import waitAnimation from "../public/wait.json";

const LoadingPlaceholder = () => <div></div>;

const WelcomeAnimation = React.memo(() => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-sky-800 via-sky-600 to-sky-400 overflow-hidden">
      <div className="text-center z-10 relative px-4">
        <div className="w-64 h-64 mx-auto mb-8">
          <DynamicLottie
            animationData={handAnimation}
            loop={true}
            autoplay={true}
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Welcome to Latur Hostel
        </h1>
        <p className="text-lg md:text-xl text-sky-100">
          Your Home Away From Home
        </p>
      </div>
    </div>
  );
});

const LoadingOverlay = React.memo(() => (
  <div className="fixed inset-0 flex items-center justify-center bg-sky-800/80 z-40">
    <div className="w-24 h-24">
      <DynamicLottie
        animationData={waitAnimation}
        loop={true}
        autoplay={true}
      />
    </div>
  </div>
));

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-r from-sky-50 to-white">
      <Container maxWidth={false} className="px-2 relative z-10">
        <Suspense fallback={<LoadingPlaceholder />}>
          <Navbar />
        </Suspense>
        <Suspense fallback={<LoadingOverlay />}>
          <DynamicHomePageContent />
        </Suspense>
      </Container>
      {isLoading && <WelcomeAnimation />}
    </div>
  );
};

export default HomePage;
