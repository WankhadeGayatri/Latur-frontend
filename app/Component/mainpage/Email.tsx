"use client";
import React from "react";
import { Mail } from "lucide-react";
import { Phone } from "@mui/icons-material";

const Email: React.FC = () => {
  const emails = [
    "enquires@laturhostel.com",
    "contact@laturhostel.com",
    "info@laturhostel.com",
  ];

  return (
    <nav className="bg-white shadow-md w-full py-3">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-6xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Mail className="text-blue-600 w-5 h-5" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <a
                href="mailto:enquires@laturhostel.com"
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                enquires@laturhostel.com
              </a>
              <a
                href="mailto:contact@laturhostel.com"
                className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium hidden sm:block"
              >
                contact@laturhostel.com
              </a>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Phone className="text-green-600 w-5 h-5" />
          <span className="text-sm text-gray-700 font-medium">
            +91 1234567890
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Email;
