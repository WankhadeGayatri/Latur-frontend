import React from "react";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Logo and Company Name Section */}
          <div className="flex flex-col items-center md:flex-row md:justify-start gap-3 mb-4">
            <div className="relative w-12 h-12">
              <Image
                src="/logo/logo.png"
                alt="Latur Hostel Logo"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold text-white">Latur Hostel</h3>
          </div>

          {/* Copyright and Information Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
            <div className="flex flex-col gap-2 text-center md:text-left max-w-xl">
              <p className="text-gray-300">
                Copyright © {currentYear} | All Rights Reserved by Dossiefoyer
                Pvt Ltd.
              </p>
              <p className="text-gray-400 font-medium">
                Developed and Maintained by dossiefoyer
              </p>
            </div>

            <div className="text-center md:text-right max-w-xl">
              <p className="text-gray-400 text-xs leading-relaxed">
                Images shown are for representational purposes only. Amenities
                depicted may or may not form a part of that individual property.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
