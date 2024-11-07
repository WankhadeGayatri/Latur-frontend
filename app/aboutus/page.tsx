import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  ArrowUp,
  Hotel,
  Users,
  UserCog,
} from "lucide-react";
import Navbar from "../Component/mainpage/Navbar";
import Footer from "../Component/mainpage/Footer";

const AboutPage = () => {
  // Sample staff data
  const staffMembers = [
    {
      name: "John Doe",
      role: "General Manager",
      image: "/Images/about/team-1.jpg",
    },
    {
      name: "Jane Smith",
      role: "Front Desk Manager",
      image: "/Images/about/team-2.jpg",
    },
    {
      name: "Mike Johnson",
      role: "Head Chef",
      image: "/Images/about/team-3.jpg",
    },
    {
      name: "Sarah Williams",
      role: "Housekeeping Manager",
      image: "/Images/about/team-4.jpg",
    },
  ];
  const stats = [
    {
      icon: <Hotel className="w-8 h-8 text-sky-500" />,
      count: 1234,
      label: "Hostel",
    },
    {
      icon: <UserCog className="w-8 h-8 text-sky-500" />,
      count: 1234,
      label: "HostelOwners",
    },
    {
      icon: <Users className="w-8 h-8 text-sky-500" />,
      count: 1234,
      label: "Students",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Page Header */}

        {/* About Section */}
        <div className="py-20 bg-white">
          {" "}
          {/* Container with vertical padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {" "}
            {/* Responsive container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {" "}
              {/* Two-column layout */}
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                {/* Section Title with specific styling */}
                <h6 className="text-sky-500 uppercase font-semibold tracking-wide">
                  About Us
                </h6>

                {/* Main Heading with branded element */}
                <h1 className="text-3xl lg:text-4xl font-bold">
                  Welcome to{" "}
                  <span className="text-sky-500 uppercase">latur hostel</span>
                </h1>

                {/* Description paragraph */}
                <p className="text-gray-600 leading-relaxed">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 pb-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="group animate-fadeIn"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {/* Double border effect using nested divs */}
                      <div className="border border-gray-200 rounded-lg p-1 transition-all duration-300 group-hover:border-sky-200">
                        <div className="border border-gray-200 rounded-lg p-4 text-center transition-all duration-300 group-hover:border-sky-200">
                          {/* Icon */}
                          <div className="mb-2 flex justify-center">
                            {stat.icon}
                          </div>
                          {/* Counter */}
                          <h2 className="text-2xl font-bold mb-1 text-gray-800">
                            {stat.count}
                          </h2>
                          {/* Label */}
                          <p className="text-gray-600 text-sm">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-lg transition-colors duration-300">
                  Explore More
                </button>
              </div>
              {/* Right Column - Image Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Image Grid with specific sizing and positioning */}
                <div className="space-y-4 text-right">
                  <div
                    className="relative inline-block w-3/4 mt-[25%] animate-zoomIn"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <img
                      src="/Images/about/about-1.jpg"
                      alt="Hotel view 1"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div
                    className="relative inline-block w-1/2 animate-zoomIn"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <img
                      src="/Images/about/about-2.jpg"
                      alt="Hotel view 3"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div
                    className="relative inline-block w-full animate-zoomIn"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <img
                      src="/Images/about/about-3.jpg"
                      alt="Hotel view 2"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                  <div
                    className="relative inline-block w-3/4 animate-zoomIn"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <img
                      src="/Images/about/about-4.jpg"
                      alt="Hotel view 4"
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-blue-600 uppercase font-semibold">
                Our Team
              </span>
              <h2 className="text-4xl font-bold mt-2">
                Explore Our <span className="text-blue-600">Teams</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {staffMembers.map((staff, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Facebook className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        <Instagram className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-center p-6 mt-4">
                    <h3 className="font-bold text-lg">{staff.name}</h3>
                    <p className="text-gray-600 text-sm">{staff.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto border rounded-lg p-8 bg-white shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">
                  Subscribe Our{" "}
                  <span className="text-blue-600">Newsletter</span>
                </h3>
                <div className="relative max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button className="fixed bottom-8 right-8 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700">
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
