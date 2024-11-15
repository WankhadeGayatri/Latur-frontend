"use client";
import React, { useEffect, useRef } from "react";
import { Shield, Hotel, Star, Clock, Check } from "lucide-react";
import { Button } from "@mui/material";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface PlanFeature {
  title: string;
  features: string[];

  buttonText: string;
  isPrime?: boolean;
}

const features = [
  {
    icon: <Shield size={24} />,
    title: "Secure Management",
    description: "Advanced security protocols",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <Hotel size={24} />,
    title: "Smart Booking",
    description: "AI-powered reservations",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <Star size={24} />,
    title: "Guest Reviews",
    description: "Feedback management",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: <Clock size={24} />,
    title: "24/7 Support",
    description: "Premium service",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-400",
  },
  // Duplicate features for infinite scroll effect
  {
    icon: <Shield size={24} />,
    title: "Data Protection",
    description: "Enterprise security",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <Hotel size={24} />,
    title: "Smart Revenue",
    description: "Maximize earnings",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
];

const GlassFeatureSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scroll = () => {
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-gray-900 via-purple-900 to-violet-900 p-4 rounded-xl">
      <div ref={sliderRef} className="flex overflow-x-hidden gap-4 py-2">
        {features.concat(features).map((feature, index) => (
          <div
            key={index}
            className={`
              flex-none w-56 h-28
              rounded-lg
              backdrop-blur-md backdrop-filter
              border border-white/10
              bg-gradient-to-br ${feature.gradient}
              p-3
              transition-all duration-300
              hover:scale-105
            `}
          >
            <div className="h-full flex flex-col justify-between">
              <div className={`${feature.iconColor}`}>{feature.icon}</div>
              <div>
                <h3 className="text-base font-semibold text-white mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-gray-200 text-xs">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanCard: React.FC<PlanFeature> = ({
  title,
  features,
  buttonText,
  isPrime,
}) => (
  <div
    className={`relative p-4 rounded-2xl ${
      isPrime
        ? "bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 text-white"
        : "bg-white border-2 border-gray-100"
    }`}
  >
    {isPrime && (
      <div className="absolute -top-3 right-4 bg-yellow-400 text-gray-900 px-3 py-0.5 rounded-full text-sm font-semibold">
        Most Popular
      </div>
    )}
    <div className="mb-3">
      <h3
        className={`text-xl font-bold mb-1 ${
          isPrime ? "text-white" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <div className="flex items-baseline">
        <span
          className={`${isPrime ? "text-gray-100" : "text-gray-500"} text-sm`}
        >
          /month
        </span>
      </div>
    </div>
    <ul className="space-y-2 mb-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check
            className={`w-4 h-4 mr-2 ${
              isPrime ? "text-yellow-300" : "text-green-500"
            }`}
          />
          <span
            className={`${isPrime ? "text-gray-100" : "text-gray-600"} text-sm`}
          >
            {feature}
          </span>
        </li>
      ))}
    </ul>
    <Button
      className={`w-full py-1.5 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
        isPrime
          ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
          : "bg-gray-900 hover:bg-gray-800 text-white"
      }`}
    >
      {buttonText}
    </Button>
  </div>
);

const plans: PlanFeature[] = [
  {
    title: "Free Plan",

    features: [
      "Basic booking management",
      "Up to 10 guest profiles",
      "Standard support",
      "Basic analytics",
      "Single property",
    ],
    buttonText: "Start Free Trial",
  },
  {
    title: "Prime Plan",

    features: [
      "Unlimited guest profiles",
      "24/7 priority support",
      "Advanced analytics & reports",
      "Multiple properties",
      "Custom branding",
    ],
    buttonText: "Upgrade to Prime",
    isPrime: true,
  },
];

const FeatureCard: React.FC<Feature> = ({
  icon,
  title,
  description,
  color,
}) => (
  <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div
      className={`${color} mb-4 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

const PrimeFeatures: React.FC = () => {
  return (
    <div className="min-h-screen pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Pricing Section */}
        <div className="text-center mb-12">
          <div className="inline-block backdrop-blur-lg  px-8 py-6 rounded-xl border border-gray-200/50 shadow-lg">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 drop-shadow-lg mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Choose the perfect plan for your business needs
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>

        {/* Feature Slider Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block backdrop-blur-sm bg-white/10 px-8 py-3 rounded-full shadow-lg">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 drop-shadow-lg">
                Discover Our Premium Features
              </h3>
            </div>
          </div>
          <GlassFeatureSlider />
        </div>
      </div>
    </div>
  );
};

export default PrimeFeatures;
