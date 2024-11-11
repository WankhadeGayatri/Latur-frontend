"use client";
import React from "react";
import Navbar from "../Component/mainpage/Navbar";
import Footer from "../Component/mainpage/Footer";

const AboutPage = () => {
  const features = [
    {
      title: "Our Mission",
      description:
        "To provide safe, comfortable, and affordable accommodation solutions for students while creating a supportive community environment with direct hostel owner connections.",
      bulletPoints: [
        "No middle man between students and hostel owners",
        "Direct communication for faster problem resolution",
      ],
    },
    {
      title: "Our Vision",
      description:
        "To become the leading platform connecting students with quality hostel accommodations, making the hostel-finding process seamless and reliable.",
      bulletPoints: [
        "Quality assurance standards",
        "Seamless booking experience",
      ],
    },
  ];
  const teamMembers = [
    {
      name: "",
      role: "Founder & CEO",
      image: "/Images/about/team-1.jpg",
    },
    {
      name: "",
      role: "Operations Director",
      image: "/Images/about/team-2.jpg",
    },
    {
      name: "",
      role: "Customer Relations",
      image: "/Images/about/team-3.jpg",
    },
    {
      name: "",
      role: "Technology Head",
      image: "/Images/about/team-4.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-sky-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-sky-600">Latur Hostel</span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Connecting students with their ideal accommodation since 2024.
                We're committed to making the hostel search process simple,
                transparent, and reliable.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Grid Layout */}

              {/* Main Container */}
              <div className="w-full">
                {/* Mobile Layout (Single Column) */}
                <div className="block sm:hidden space-y-4">
                  <div
                    className="animate-zoomIn"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <img
                      src="/Images/about/about-1.jpg"
                      alt="Hotel view 1"
                      className="rounded-xl shadow-lg w-full h-[200px] object-cover"
                    />
                  </div>
                  <div
                    className="animate-zoomIn"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <img
                      src="/Images/about/about-3.jpg"
                      alt="Hotel view 2"
                      className="rounded-xl shadow-lg w-full h-[200px] object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div
                      className="w-1/2 animate-zoomIn"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <img
                        src="/Images/about/about-2.jpg"
                        alt="Hotel view 3"
                        className="rounded-xl shadow-lg w-full h-[150px] object-cover"
                      />
                    </div>
                    <div
                      className="w-1/2 animate-zoomIn"
                      style={{ animationDelay: "0.7s" }}
                    >
                      <img
                        src="/Images/about/about-4.jpg"
                        alt="Hotel view 4"
                        className="rounded-xl shadow-lg w-full h-[150px] object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Desktop Layout (Two Columns) */}
                <div className="hidden sm:grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4 text-right">
                    <div
                      className="relative inline-block w-[85%] mt-[25%] animate-zoomIn"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <img
                        src="/Images/about/about-1.jpg"
                        alt="Hotel view 1"
                        className="rounded-xl shadow-xl h-[300px] w-full object-cover"
                      />
                    </div>
                    <div
                      className="relative inline-block w-[60%] animate-zoomIn"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <img
                        src="/Images/about/about-2.jpg"
                        alt="Hotel view 3"
                        className="rounded-xl shadow-xl h-[200px] w-full object-cover"
                      />
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div
                      className="relative inline-block w-[100%] animate-zoomIn"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <img
                        src="/Images/about/about-3.jpg"
                        alt="Hotel view 2"
                        className="rounded-xl shadow-xl h-[350px] w-full object-cover"
                      />
                    </div>
                    <div
                      className="relative inline-block w-[85%] animate-zoomIn"
                      style={{ animationDelay: "0.7s" }}
                    >
                      <img
                        src="/Images/about/about-4.jpg"
                        alt="Hotel view 4"
                        className="rounded-xl shadow-xl h-[200px] w-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Animation Styles */}
                <style jsx>{`
                  @keyframes zoomIn {
                    from {
                      opacity: 0;
                      transform: scale(0.95);
                    }
                    to {
                      opacity: 1;
                      transform: scale(1);
                    }
                  }
                  .animate-zoomIn {
                    animation: zoomIn 0.6s ease-out forwards;
                  }
                `}</style>
              </div>

              {/* Right Column - Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Creating Better Living Spaces for Students
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    At Latur Hostel, we understand the challenges students face
                    when looking for accommodation. Our platform bridges the gap
                    between students and quality hostel facilities, ensuring a
                    smooth and trustworthy booking experience.
                  </p>
                </div>

                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="bg-sky-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {feature.description}
                      </p>
                      {feature.bulletPoints && (
                        <ul className="space-y-2">
                          {feature.bulletPoints.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="flex items-start gap-3 text-gray-600"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Why Choose Us Section */}
        {/* Why Choose Us Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Why Choose Us?
              </h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                We provide the best hostel experience with our comprehensive
                services and dedication to student comfort
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Safety & Security */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Safety & Security
                </h3>
                <p className="text-gray-600">
                  24/7 security systems and strict access controls to ensure
                  student safety at all times.
                </p>
              </div>

              {/* Location Convenience */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Prime Locations
                </h3>
                <p className="text-gray-600">
                  Strategically located hostels near educational institutions
                  and public transport.
                </p>
              </div>

              {/* Affordable Pricing */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Affordable Pricing
                </h3>
                <p className="text-gray-600">
                  Competitive rates with flexible payment options to suit every
                  student's budget.
                </p>
              </div>

              {/* No Middle Man - New Feature */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 text-sky-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Middle Man
                </h3>
                <p className="text-gray-600">
                  Direct connection between students and hostel owners, ensuring
                  transparent communication and better rates.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Team Section */}

        {/* Get in Touch Section */}
        <div className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sky-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                    Get in Touch
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
                    Have questions about our hostels? Feel free to reach out to
                    us. We're here to help!
                  </p>
                  Contact us at: support@laturhostel.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
