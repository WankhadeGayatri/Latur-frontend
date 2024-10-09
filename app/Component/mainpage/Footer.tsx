import { Facebook, Instagram } from "@mui/icons-material";
import { Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <Image
              src={"/Images/HostelLogo4.png"}
              alt="Stanza Living"
              width={150}
              height={50}
              className="rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white">About Us</h3>
              <a href="#" className="text-gray-300 hover:text-white">
                Team
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Investor Relations
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Media
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white">Blogs</h3>
              <a href="#" className="text-gray-300 hover:text-white">
                FAQs
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Refer and Earn
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                House Rules
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white">T&C</h3>
              <a href="#" className="text-gray-300 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                Contact Us
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                COVID-19
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold text-white">Partner With Us</h3>
              <a href="#" className="text-gray-300 hover:text-white">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" aria-label="Facebook">
              <Facebook className="text-white hover:text-blue-500" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="text-white hover:text-blue-700" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="text-white hover:text-pink-500" />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube className="text-white hover:text-red-600" />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            Copyright © 2024 | All Rights Reserved by Dossifoyer Pvt Ltd. |{" "}
            <a href="#" className="hover:text-white">
              Developed and Maintained by dossifoyer
            </a>
          </p>
          <p className="mt-2 md:mt-0">
            Images shown are for representational purposes only. Amenities
            depicted may or may not form a part of that individual property.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
