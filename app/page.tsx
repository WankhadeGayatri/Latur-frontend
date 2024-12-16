import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ApolloWrapper } from "./providers/ApolloWrapper";
import { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Latur Hostel - Home",
  description: "Welcome to Latur Hostel",
  verification: {
    google: "m0Xdhlzg1dE0kFe_Q_zCE5eFyvhxE3xPjQ3-wuWBiNY",
  },
};
// Optimize imports with better loading states
const Navbar = dynamic(() => import("./Component/mainpage/Navbar"), {
  loading: () => <nav className="h-16 bg-white" />,
  ssr: true,
});

const HomePageContent = dynamic(
  () => import("./Component/mainpage/HomePageContent"),
  {
    loading: () => <LoadingState />,
    ssr: true,
  }
);

// Simplified loading state component with skeleton UI
const LoadingState = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="h-48 bg-sky-100 rounded-lg"></div>
    <div className="h-8 bg-sky-100 rounded w-3/4"></div>
    <div className="h-4 bg-sky-100 rounded w-1/2"></div>
  </div>
);

const HomePage = () => {
  return (
    <>
      {" "}
      <Head>
        <meta
          name="google-site-verification"
          content="m0Xdhlzg1dE0kFe_Q_zCE5eFyvhxE3xPjQ3-wuWBiNY"
        />
      </Head>
      <ApolloWrapper>
        <div className="min-h-screen bg-gradient-to-r from-sky-50 to-white">
          <div className="max-w-[2000px] mx-auto ">
            <Suspense fallback={<nav className="h-16 bg-white" />}>
              <Navbar />
            </Suspense>

            <main>
              <Suspense fallback={<LoadingState />}>
                <HomePageContent />
              </Suspense>
            </main>
          </div>
        </div>
      </ApolloWrapper>
    </>
  );
};

export default HomePage;
