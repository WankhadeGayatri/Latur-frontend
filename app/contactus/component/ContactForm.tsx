import React from "react";
import { useState } from "react";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  allowNotifications: boolean;
}

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    country: "India",
    allowNotifications: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-3xl overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56">
        <Image
          src="/logo/l.jpg"
          alt="Building"
          width={200}
          height={200}
          className="object-cover rounded-t-3xl w-full h-full"
          priority
        />
      </div>

      {/* Form Content */}
      <div className="px-6 py-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">
            Welcome To Latur Hostel
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Find Your Dream Home Today With Our Expert Assistance
          </p>
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
              className="w-full p-3 bg-gray-100 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
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
              className="w-full p-3 bg-gray-100 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
              required
            />
          </div>

          {/* Country and Phone Container */}
          <div className="flex gap-3">
            {/* Country Select */}
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-1/3 p-3 bg-gray-100 rounded-xl border-none focus:ring-1 focus:ring-blue-500 text-gray-500"
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
              className="w-2/3 p-3 bg-gray-100 rounded-xl border-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
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
            <label htmlFor="notifications" className="text-sm text-gray-600">
              Allow Notifications and Updates
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition-colors duration-200 text-sm font-semibold uppercase"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
