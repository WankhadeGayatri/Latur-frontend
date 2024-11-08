"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Player, PlayerEvent } from "@lottiefiles/react-lottie-player";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Home,
  Coffee,
  Lock,
  Clock as Stay,
  TicketIcon,
  Wifi,
  Shield,
  Book,
  Power,
  Fan,
  Sun,
  FileText,
  Calendar,
  MessageCircle,
  HelpCircle,
  Key,
  Users,
  Check,
  Wind,
  Utensils,
} from "lucide-react";
import { gsap } from "gsap";
import student from "../../../public/student.json";
interface Slide {
  title: string;
  description: string;
}
import { motion, AnimatePresence } from "framer-motion";
type ScreenName = "welcome" | "home" | "support";

interface ExamBubble {
  name: string;
  color: string;
}
interface Slide {
  title: string;
  description: string;
  image?: string;
}
interface Service {
  icon: React.ReactNode;
  name: string;
  color: string;
}
interface NavigationProps {
  onNext: () => void;
  onPrev: () => void;
}

interface Slide {
  title: string;
  description: string;
  image?: string;
}

interface Step {
  icon: React.ReactNode;
  text: string;
}
const NavigationButtons: React.FC<NavigationProps> = ({ onNext, onPrev }) => (
  <div className="absolute inset-0 w-[320px] mx-auto z-20 pointer-events-none">
    <div className="relative h-full flex items-center justify-between px-2">
      <button
        onClick={onPrev}
        className="pointer-events-auto opacity-70 hover:opacity-100 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-all duration-200 group"
        aria-label="Previous screen"
      >
        <ChevronLeft
          size={18}
          className="text-gray-600 group-hover:text-gray-800"
        />
      </button>
      <button
        onClick={onNext}
        className="pointer-events-auto opacity-70 hover:opacity-100 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-all duration-200 group"
        aria-label="Next screen"
      >
        <ChevronRight
          size={18}
          className="text-gray-600 group-hover:text-gray-800"
        />
      </button>
    </div>
  </div>
);

const WelcomeScreen: React.FC<NavigationProps> = ({ onNext, onPrev }) => {
  const examBubbles: ExamBubble[] = [
    { name: "NEET", color: "bg-blue-400" },
    { name: "JEE", color: "bg-green-400" },
    { name: "CA", color: "bg-yellow-400" },
    { name: "GATE", color: "bg-red-400" },
    { name: "UPSC", color: "bg-purple-400" },
    { name: "CAT", color: "bg-pink-400" },
  ];

  return (
    <div className="relative h-full  pb-20 px-4 flex flex-col items-center justify-center bg-white">
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
      <h1 className="text-xl mt-2 font-bold mb-2 text-blue-800">
        Welcome to Latur Hostel
      </h1>
      <div className="relative w-64 h-64">
        <Player
          autoplay
          loop
          src={student}
          style={{ width: "100%", height: "100%" }}
        />
        {examBubbles.map((bubble, index) => (
          <div
            key={bubble.name}
            className={`exam-bubble absolute ${bubble.color} rounded-full p-2 text-white text-xs font-semibold shadow-lg`}
            style={{
              top: `${50 + 40 * Math.sin((index * Math.PI) / 3)}%`,
              left: `${50 + 40 * Math.cos((index * Math.PI) / 3)}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {bubble.name}
          </div>
        ))}
        <p className="mt-6 text-center text-gray-700 max-w-xs">
          Welcome to Latur hostel, located near top tuition centers, where a
          friendly environment fosters your academic success. Join our vibrant
          community and enjoy the comfort
        </p>
      </div>
    </div>
  );
};

const HomeScreen: React.FC<NavigationProps> = ({ onNext, onPrev }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides: Slide[] = [
    {
      title: "Welcome to Latur Hostel",
      description: "Your home away from home",
      image:
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Modern Amenities",
      description: "Enjoy comfort and convenience",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Study Environment",
      description: "Focused spaces for academic success",
      image:
        "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];
  const services: Service[] = [
    {
      icon: <Sun size={24} />,
      name: "Solar Power",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <Wifi size={24} />,
      name: "High-Speed WiFi",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Book size={24} />,
      name: "Study Rooms",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <Shield size={24} />,
      name: "24/7 Security",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <Wind size={24} />,
      name: "AC Rooms",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Users size={24} />,
      name: "Community Areas",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <Utensils size={24} />,
      name: "Quality Mess",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Power size={24} />,
      name: "Power Backup",
      color: "bg-gray-100 text-gray-600",
    },
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-full pt-12 pb-20 px-4 bg-gray-50 overflow-y-auto">
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
      <div className="relative h-64 mb-6 rounded-xl overflow-hidden shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-bold">
                {slides[currentSlide].title}
              </h2>
              <p className="text-white text-sm mt-2">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white rounded-lg p-4 shadow-md flex items-center justify-center">
            <Home size={20} className="mr-2" />
            <span>Book a Room</span>
          </button>
          <button className="bg-green-600 text-white rounded-lg p-4 shadow-md flex items-center justify-center">
            <Coffee size={20} className="mr-2" />
            <span>View Amenities</span>
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Our Services
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`${service.color} rounded-lg p-4 shadow-md flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {service.icon}
              <span className="ml-3 font-medium">{service.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          What Students Say
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 italic">
            "Latur Hostel provided me with the perfect environment to focus on
            my studies and make lifelong friends. The amenities are top-notch!"
          </p>
          <p className="text-gray-800 font-semibold mt-2">
            - Priya S., Engineering Student
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Ready to Join Our Community?
        </h2>
        <p className="mb-4">
          Experience the best of student living at Latur Hostel.
        </p>
        <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full flex items-center">
          Apply Now
          <ChevronRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};
const SupportScreen: React.FC<NavigationProps> = ({ onNext, onPrev }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [currentSupportSlide, setCurrentSupportSlide] = useState(0);

  const supportSlides = [
    { title: "24/7 Support", description: "We're here to help anytime" },
    {
      title: "Quick Resolutions",
      description: "Fast and efficient problem-solving",
    },
    { title: "Take Admission", description: "Follow These Steps" },
  ];
  const steps: Step[] = [
    { icon: <Home size={20} />, text: "1. Registration Process" },
    { icon: <Home size={20} />, text: "1. Registration Process" },
    { icon: <Key size={20} />, text: "2. Log in to Your Account" },
    { icon: <Book size={20} />, text: "3. Explore Hostel Options" },
    { icon: <ThumbsUp size={20} />, text: "4. Add to Wishlist" },
    { icon: <Users size={20} />, text: "5. Submit Wishlist for Approval" },
    { icon: <Calendar size={20} />, text: "6. Schedule Visit to Hostel" },
    { icon: <MessageCircle size={20} />, text: "7. Provide Feedback" },
    { icon: <Check size={20} />, text: "8. Take Admission" },
    { icon: <FileText size={20} />, text: "9. Complete Formalities" },
    { icon: <HelpCircle size={20} />, text: "10. Follow Hostel Guidelines" },
  ];

  useEffect(() => {
    const stepHeight: number = 60;

    if (stepsRef.current) {
      stepsRef.current.scrollTop = currentStepIndex * stepHeight;
    }
  }, [currentStepIndex]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="relative h-full pt-12 pb-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <NavigationButtons onNext={onNext} onPrev={onPrev} />
      <div className="flex justify-center items-center mb-6">
        {/* <ChevronLeft size={24} className="text-blue-600" /> */}
        <h1 className="text-xl font-bold text-blue-800">Steps to get hostel</h1>
      </div>

      {/* Autoplay Slider for Support Screen */}
      <div className="mb-6 relative h-20 rounded-lg overflow-hidden bg-white shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSupportSlide}
            className="absolute inset-0 flex flex-col justify-center items-center p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-blue-700">
              {supportSlides[currentSupportSlide].title}
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {supportSlides[currentSupportSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <h2 className="font-bold text-lg mb-4 text-blue-800">
        Admission Process
      </h2>
      <div
        ref={stepsRef}
        className="bg-white rounded-lg shadow-lg p-4 mb-6 h-64 overflow-hidden"
      >
        <div className="space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center py-3 border-b border-gray-100 last:border-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                {step.icon}
              </div>
              <span className="text-sm text-gray-700">{step.text}</span>
              <ChevronRight size={16} className="ml-auto text-blue-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button className="bg-blue-600 text-white rounded-full py-2 px-4 text-sm font-semibold flex items-center shadow-lg hover:bg-blue-700 transition duration-300">
          <HelpCircle size={16} className="mr-2" />
          <span>Get Help</span>
        </button>
        <button className="bg-purple-600 text-white rounded-full py-2 px-4 text-sm font-semibold flex items-center shadow-lg hover:bg-purple-700 transition duration-300">
          <MessageCircle size={16} className="mr-2" />
          <span>Raise a Complaint</span>
        </button>
      </div>
    </div>
  );
};

const MobileApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("welcome");
  const [showControls, setShowControls] = useState(true);
  const appRef = useRef<HTMLDivElement>(null);
  const screens: ScreenName[] = ["welcome", "home", "support"];

  const handleNextScreen = useCallback((): void => {
    setCurrentScreen((prevScreen) => {
      const currentIndex = screens.indexOf(prevScreen);
      return screens[(currentIndex + 1) % screens.length];
    });
  }, []);

  const handlePrevScreen = useCallback((): void => {
    setCurrentScreen((prevScreen) => {
      const currentIndex = screens.indexOf(prevScreen);
      return screens[(currentIndex - 1 + screens.length) % screens.length];
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNextScreen, 10000);
    return () => clearInterval(timer);
  }, [handleNextScreen]);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setShowControls(false), 3000);
    };

    const container = appRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchstart", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchstart", handleMouseMove);
      }
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="relative mt-10 flex items-center justify-center h-screen overflow-hidden">
      <div
        ref={appRef}
        className="relative w-[320px] h-[650px] bg-black rounded-[40px] p-2 shadow-xl"
      >
        <div className="w-full h-full bg-white rounded-[35px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="top-0 left-0 right-0 h-[44px] bg-white flex items-center justify-between px-6 text-black z-30">
            <span className="text-sm font-semibold">9:41 AM</span>
            <div className="flex items-center space-x-1">
              <div className="w-6 h-3 bg-black rounded-sm relative">
                <div className="right-[2px] top-[2px] bottom-[2px] left-[9px] bg-black rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative h-[calc(100%-104px)]">
            <AnimatePresence initial={false} custom={currentScreen}>
              <motion.div
                key={currentScreen}
                custom={currentScreen}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: "tween", duration: 0.5 }}
                className="absolute inset-0"
              >
                {showControls && (
                  <>
                    {currentScreen === "welcome" && (
                      <WelcomeScreen
                        onNext={handleNextScreen}
                        onPrev={handlePrevScreen}
                      />
                    )}
                    {currentScreen === "support" && (
                      <SupportScreen
                        onNext={handleNextScreen}
                        onPrev={handlePrevScreen}
                      />
                    )}
                    {currentScreen === "home" && (
                      <HomeScreen
                        onNext={handleNextScreen}
                        onPrev={handlePrevScreen}
                      />
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-2 left-2 right-2 h-[60px] bg-gray-800 rounded-[30px] flex justify-around items-center">
            <Home size={24} className="text-white" />
            <Coffee size={24} className="text-white" />
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center -mt-6">
              <Lock size={24} className="text-white" />
            </div>
            <Stay size={24} className="text-white" />
            <Coffee size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
