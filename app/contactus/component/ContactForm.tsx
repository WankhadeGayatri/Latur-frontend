"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  allowNotifications: boolean;
}

interface ContactFormProps {
  imageHeight?: string;
  imageWidth?: string;
  imageFit?: "cover" | "contain" | "fill";
  imagePosition?: string;
  imageSrc?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  imageHeight = "h-48",
  imageWidth = "w-full",
  imageFit = "cover",
  imagePosition = "object-center",
  imageSrc = "/Images/LaturHostelLogo.png",
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    country: "India",
    allowNotifications: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const templateParams = {
        to_email: "anuragsulkiya@gmail.com",
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        country: formData.country,
        notifications: formData.allowNotifications ? "Yes" : "No",
        message: `
          Name: ${formData.name}
          Email: ${formData.email}
          Phone: ${formData.phone}
          Country: ${formData.country}
          Notifications: ${formData.allowNotifications ? "Yes" : "No"}
        `,
      };

      // Replace these with your actual EmailJS credentials
      const result = await emailjs.send(
        "service_ban2vye", // Get from EmailJS dashboard
        "template_fzneikb", // Get from EmailJS dashboard
        templateParams,
        "Wv6TvP7-bndVjA0Mg" // Get from EmailJS dashboard
      );

      if (result.text === "OK") {
        alert("Message sent successfully!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          country: "India",
          allowNotifications: false,
        });
      }
    } catch (error) {
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-sm rounded-3xl overflow-hidden">
      {/* Image Section with configurable properties */}
      <div className={`relative ${imageWidth} ${imageHeight}`}>
        <Image
          src="/logo/lb.svg"
          alt="logo"
          fill
          className={`${
            imageFit === "contain"
              ? "object-contain"
              : imageFit === "fill"
              ? "object-fill"
              : "object-cover"
          } 
                     ${imagePosition} rounded-t-3xl`}
          priority
        />
      </div>

      {/* Form Content */}
      <div className="px-6 py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-[28px] font-semibold text-sky-600">
            Welcome To Latur Hostel
          </h2>
          <span className="text-sm text-gray-600 mt-1">
            Find Your Dream Home Today With Our Expert Assistance
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-700"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Id"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-700"
              required
            />
          </div>

          {/* Country and Phone Container */}
          <div className="flex gap-3">
            {/* Country Select */}
            <label htmlFor="country-select" className="sr-only">
              Select your country
            </label>
            <select
              id="country-select"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-60% p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-700"
              required
            >
              <option value="India">India</option>
              <option value="Other">Other</option>
            </select>

            {/* Phone Input */}
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-700"
              required
            />
          </div>

          {/* Notifications Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifications"
              name="allowNotifications"
              checked={formData.allowNotifications}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="notifications" className="text-sm text-gray-700">
              Allow Notifications and Updates
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-[#00509E] text-white rounded-full hover:bg-blue-900 transition-colors duration-200 text-sm font-semibold uppercase disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
