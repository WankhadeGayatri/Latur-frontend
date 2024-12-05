"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Server, RefreshCw, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const BackendErrorPage: React.FC = () => {
  const handleRefresh = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="flex justify-center"
          >
            <Server className="h-16 w-16 text-indigo-500" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">
            System Maintenance
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            We're currently experiencing some technical difficulties with our
            servers. Our team is working hard to resolve this issue.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <span className="text-amber-800 font-medium">
              System Status: Maintenance
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </motion.button>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:support@yourdomain.com"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-gray-700 font-medium border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Contact Support
          </motion.a>
        </div>

        {/* Additional Information */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">
            What you can do:
          </h2>
          <ul className="space-y-3">
            {[
              "Try refreshing the page",
              "Clear your browser cache",
              "Check back in a few minutes",
              "Contact our support team if the issue persists",
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3 text-gray-600"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>Need immediate assistance? Our support team is available 24/7</p>
          <p className="mt-1">Error Code: SERVICE_UNAVAILABLE</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BackendErrorPage;
