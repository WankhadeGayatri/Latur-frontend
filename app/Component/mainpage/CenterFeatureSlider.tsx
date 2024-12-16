import React from "react";
import { Home, Zap, ShieldCheck, Utensils, Bus, Waves } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  color?: {
    iconCircle?: string;
  };
}

const features: Feature[] = [
  {
    icon: Home,
    title: "Student Friendly",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
  {
    icon: Zap,
    title: "Power Backup",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
  {
    icon: Waves,
    title: "Hygiene",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
  {
    icon: ShieldCheck,
    title: "24/7 Security",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
  {
    icon: Utensils,
    title: "Food & Mess",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
  {
    icon: Bus,
    title: "Pick Up & Drop",
    color: {
      iconCircle: "bg-blue-300",
    },
  },
];

const FeatureCard: React.FC<Feature> = ({ icon: Icon, title }) => (
  <div className="flex flex-col items-center space-y-1 w-full max-w-[160px]">
    <div className="relative">
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-4 h-4 bg-blue-300 rounded-full opacity-70"
      ></div>
      <Icon className="relative text-gray-600 z-10" size={40} strokeWidth={1} />
    </div>
    <p className="text-md text-gray-800 font-light text-center">{title}</p>
  </div>
);

const FeatureSlider: React.FC = () => {
  return (
    <div className="w-full overflow-hidden py-7 relative">
      <div className="absolute inset-0 pointer-events-none z-10"></div>
      <div
        className="flex animate-continuous-scroll"
        style={{
          width: `${features.length * 200 * 3}px`, // Increased to ensure smooth loop
        }}
      >
        {[
          ...features,
          ...features,
          ...features,
          ...features,
          ...features,
          ...features,
        ].map((feature, index) => (
          <div
            key={index}
            className="flex-none mx-0"
            style={{ width: "clamp(150px, 18vw, 200px)" }}
          >
            <FeatureCard {...feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CenteredFeatureSlider: React.FC = () => (
  <div className="flex items-center justify-center w-full overflow-hidden">
    <style jsx global>{`
      @keyframes continuousScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      .animate-continuous-scroll {
        animation: continuousScroll 20s linear infinite;
      }
    `}</style>
    <FeatureSlider />
  </div>
);

export default CenteredFeatureSlider;
