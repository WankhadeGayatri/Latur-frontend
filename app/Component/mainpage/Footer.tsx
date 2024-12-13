import React, { useState } from "react";
import Image from "next/image";
import { Phone, Mail, Send } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Submitted:", { email, phone, message });
    setSubmitted(true);
    setEmail("");
    setPhone("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-2 py-2">
        <div className="flex flex-col">
          {/* Main Content Section */}
          <div className="flex flex-col items-center">
            {/* Centered Logo */}
            <div className="mb-2">
              <div className="relative w-24 h-24">
                <Image
                  src="/logo/logowhite.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Horizontal Contact Form */}
            <div className="w-full max-w-3xl">
              <div className="rounded-lg p-2 bg-gray-900/50 backdrop-blur-sm">
                <h2 className="text-[28px] font-semibold text-gray-200 mb-2 text-center">
                  Contact Us
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col md:flex-row items-center gap-2"
                >
                  <div className="w-full md:w-1/4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Your phone number"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message"
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <button
                      type="submit"
                      className="w-full md:w-auto flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="font-medium">Send</span>
                      <Send className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </form>
                {submitted && (
                  <div className="text-center text-green-400 mt-1 text-sm animate-fade-in">
                    Thank you! We'll get back to you soon.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Copyright Section */}
          <div className="mt-2 pt-2 border-t border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 py-2">
                <p className="text-gray-300 text-sm text-center sm:text-left">
                  Copyright © 2024 | All Rights Reserved by www.laturhostel.com
                </p>
                <p className="text-gray-300 text-sm text-center sm:text-left">
                  Developed and Maintained by Dossiefoyer Private Limited
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
