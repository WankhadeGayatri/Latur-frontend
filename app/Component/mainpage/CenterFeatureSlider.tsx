import React from "react";
import {
  BsGearFill,
  BsLightningChargeFill,
  BsShieldFillCheck,
  BsHouseDoorFill,
} from "react-icons/bs";
import { FaUtensils, FaBus } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";

// Enhanced Feature interface with additional properties
interface Feature {
  icon: React.ElementType;
  title: string;
  color: {
    background: string;
    icon: string;
    border: string;
  };
  description?: string;
}

// Refined color palette with more professional gradients
const features: Feature[] = [
  {
    icon: BsHouseDoorFill,
    title: "Student Friendly",
    color: {
      background: "bg-gradient-to-br from-red-50 to-red-100",
      icon: "text-red-500",
      border: "border-red-200",
    },
  },
  {
    icon: BsLightningChargeFill,
    title: "Power Backup",
    color: {
      background: "bg-gradient-to-br from-orange-50 to-orange-100",
      icon: "text-orange-500",
      border: "border-orange-200",
    },
  },
  {
    icon: MdCleaningServices,
    title: "Hygiene",
    color: {
      background: "bg-gradient-to-br from-green-50 to-green-100",
      icon: "text-green-500",
      border: "border-green-200",
    },
  },
  {
    icon: BsShieldFillCheck,
    title: "24/7 Security",
    color: {
      background: "bg-gradient-to-br from-purple-50 to-purple-100",
      icon: "text-purple-500",
      border: "border-purple-200",
    },
  },
  {
    icon: FaUtensils,
    title: "Food & Mess",
    color: {
      background: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      icon: "text-yellow-600",
      border: "border-yellow-200",
    },
  },
  {
    icon: FaBus,
    title: "Pick Up & Drop",
    color: {
      background: "bg-gradient-to-br from-blue-50 to-blue-100",
      icon: "text-blue-500",
      border: "border-blue-200",
    },
  },
];

// Enhanced FeatureCard with more dynamic styling
const FeatureCard: React.FC<Feature> = ({
  icon: Icon,
  title,
  color,
  description,
}) => (
  <div
    className={`
    flex flex-col items-center justify-center
    p-1 sm:p-3
    space-y-1 sm:space-y-2
    ${color.background}
    rounded-2xl
    shadow-md
    border
    ${color.border}
    transform transition-all
    duration-300
    hover:scale-[1.02]
    hover:shadow-lg
    hover:border-opacity-75
    w-full
    max-w-[220px]
    min-h-[110px]
    sm:min-h-[110px]
    md:min-h-[100px]
  `}
  >
    <div
      className={`
      p-2 sm:p-2
      rounded-full 
      bg-white
      shadow-sm
      mb-1 sm:mb-2
      ${color.icon}
      transition-transform
      group-hover:scale-110
    `}
    >
      <Icon className="text-xl sm:text-2xl text-center" />
    </div>
    <p
      className="
      prose-sm
      font-semibold 
      text-center 
      text-gray-800 
      tracking-tight 
      line-clamp-2
      text-base sm:text-sm
    "
    >
      {title}
    </p>
  </div>
);

const FeatureSlider: React.FC = () => {
  return (
    <div className="w-full overflow-hidden py-7">
      <div
        className="flex animate-slow-infinite-scroll"
        style={{
          width: `${features.length * 240 * 3}px`,
        }}
      >
        {[...features, ...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex-none mx-1"
            style={{ width: "clamp(180px, 22vw, 250px)" }}
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Centered Slider with Global Styles
const CenteredFeatureSlider: React.FC = () => (
  <div className="flex items-center justify-center w-full overflow-hidden">
    <style jsx global>{`
      @keyframes slowInfiniteScroll {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(-33.33%);
        }
      }

      .animate-slow-infinite-scroll {
        animation: slowInfiniteScroll 20s linear infinite;
      }
    `}</style>
    <FeatureSlider />
  </div>
);

export default CenteredFeatureSlider;
