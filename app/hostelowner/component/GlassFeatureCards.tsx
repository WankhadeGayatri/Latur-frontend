import React from "react";
import { Shield, Hotel, Star, Clock } from "lucide-react";

const features = [
  {
    icon: <Shield size={32} />,
    title: "Advanced Security",
    description: "Enterprise-grade protection for your property data",
    gradient: "from-blue-500/20 to-purple-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: <Hotel size={32} />,
    title: "Smart Booking",
    description: "AI-powered reservation management system",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: <Star size={32} />,
    title: "Guest Reviews",
    description: "Automated feedback collection and analysis",
    gradient: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: <Clock size={32} />,
    title: "24/7 Support",
    description: "Round-the-clock premium customer service",
    gradient: "from-rose-500/20 to-orange-500/20",
    iconColor: "text-rose-400",
  },
];

const GlassFeatureCards = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Premium Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`
                relative group
                aspect-square rounded-2xl 
                backdrop-blur-md backdrop-filter
                border border-white/10
                bg-gradient-to-br ${feature.gradient}
                p-6
                transition-all duration-300
                hover:scale-105 hover:shadow-2xl
                overflow-hidden
              `}
            >
              {/* Animated background blur effect */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative h-full flex flex-col justify-between">
                {/* Icon */}
                <div
                  className={`${feature.iconColor} mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-white/5 rounded-tl-3xl transform translate-x-8 translate-y-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlassFeatureCards;
