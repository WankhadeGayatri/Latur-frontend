import React from "react";
import {
  BsGearFill,
  BsLightningChargeFill,
  BsShieldFillCheck,
  BsHouseDoorFill,
} from "react-icons/bs";
import { FaUtensils, FaBus } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";

interface Feature {
  icon: React.ElementType;
  title: string;
  color: string;
}

const features: Feature[] = [
  { icon: BsHouseDoorFill, title: "Student Friendly", color: "bg-red-100" },
  {
    icon: BsLightningChargeFill,
    title: "Power Backup",
    color: "bg-orange-100",
  },
  { icon: MdCleaningServices, title: "Hygiene", color: "bg-green-100" },
  { icon: BsShieldFillCheck, title: "24/7 Security", color: "bg-purple-100" },
  { icon: FaUtensils, title: "Food & Mess", color: "bg-yellow-100" },
  { icon: FaBus, title: "Pick Up & Drop", color: "bg-blue-100" },
];

const FeatureCard: React.FC<Feature> = ({ icon: Icon, title, color }) => (
  <div
    className={`flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 ${color} rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border hover:border-sky-300`}
    style={{
      width: "clamp(120px, 22vw, 220px)",
      height: "clamp(80px, 15vw, 150px)",
    }}
  >
    <Icon
      className="text-orange-500 mb-1 sm:mb-2"
      style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
    />
    <h3
      className="font-semibold text-center"
      style={{ fontSize: "clamp(0.75rem, 1.5vw, 1rem)" }}
    >
      {title}
    </h3>
  </div>
);

const FeatureSlider: React.FC = () => {
  const totalWidth = features.length * 240;
  const animationDuration = features.length * 5;

  return (
    <div className="w-full  overflow-hidden py-4 sm:py-6 md:py-8">
      <div
        className="flex"
        style={{
          width: `${totalWidth * 3}px`,
          animation: `slide ${animationDuration}s linear infinite`,
        }}
      >
        {[...features, ...features, ...features].map((feature, index) => (
          <div
            key={index}
            className="flex-none mx-2 sm:mx-3"
            style={{ width: "clamp(120px, 22vw, 220px)" }}
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CenteredFeatureSlider: React.FC = () => (
  <div className="flex items-center  justify-center w-full overflow-hidden">
    <style jsx global>{`
      @keyframes slide {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-33.33%);
        }
      }
    `}</style>
    <FeatureSlider />
  </div>
);

export default CenteredFeatureSlider;
