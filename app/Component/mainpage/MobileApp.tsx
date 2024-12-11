"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
  Layout,
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
  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-2 flex justify-between pointer-events-none">
    <button
      onClick={onPrev}
      className="pointer-events-auto bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors z-20"
      aria-label="Previous screen"
    >
      <ChevronLeft size={18} />
    </button>
    <button
      onClick={onNext}
      className="pointer-events-auto bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors z-20"
      aria-label="Next screen"
    >
      <ChevronRight size={18} />
    </button>
  </div>
);

const WelcomeScreen: React.FC<NavigationProps> = ({ onNext, onPrev }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const examBubbles: ExamBubble[] = [
    { name: "NEET", color: "bg-blue-400" },
    { name: "JEE", color: "bg-green-400" },
    { name: "CA", color: "bg-yellow-400" },
    { name: "GATE", color: "bg-red-400" },
    { name: "UPSC", color: "bg-purple-400" },
    { name: "CAT", color: "bg-pink-400" },
  ];

  // Preset exact positions to avoid floating-point variations
  const fixedPositions = [
    { top: "15.359%", left: "30%" },
    { top: "50%", left: "85%" },
    { top: "84.641%", left: "70%" },
    { top: "84.641%", left: "30%" },
    { top: "50%", left: "15%" },
    { top: "15.359%", left: "70%" },
  ];

  return (
    <div className="relative h-full pb-16 sm:pb-20 px-2 flex flex-col items-center justify-center bg-white">
      <h1 className="text-lg sm:text-xl mt-2 font-bold mb-2 text-blue-800">
        Welcome to Latur Hostel
      </h1>
      <div className="relative w-52 h-52 sm:w-64 sm:h-64">
        <Player
          autoplay
          loop
          src={student}
          style={{ width: "100%", height: "100%" }}
        />
        {examBubbles.map((bubble, index) => (
          <div
            key={bubble.name}
            className={`exam-bubble absolute ${bubble.color} rounded-full p-1.5 sm:p-2 text-white text-[10px] sm:text-xs font-semibold shadow-lg transform transition-all duration-300 hover:scale-110`}
            style={{
              top: fixedPositions[index].top,
              left: fixedPositions[index].left,
              transform: "translate(-50%, -50%)",
              minWidth: mounted
                ? window.innerWidth < 640
                  ? "40px"
                  : "48px"
                : "40px",
              textAlign: "center",
            }}
          >
            {bubble.name}
          </div>
        ))}
      </div>
      <p className="mt-4 sm:mt-6 text-center text-gray-700 text-sm sm:text-base max-w-[250px] sm:max-w-xs leading-tight sm:leading-normal">
        Welcome to Latur hostel, located near top tuition centers, where a
        friendly environment fosters your academic success. Join our vibrant
        community and enjoy the comfort
      </p>
    </div>
  );
};

const HomeScreen: React.FC<NavigationProps> = ({ onNext, onPrev }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides: Slide[] = [
    {
      title: "Welcome to Latur Hostel",
      description: "Your home away from home",
      image: "/Images/about/about-1.jpg",
    },
    {
      title: "Modern Amenities",
      description: "Enjoy comfort and convenience",
      image: "/Images/about/about-3.jpg",
    },
    {
      title: "Study Environment",
      description: "Focused spaces for academic success",
      image: "/Images/about/about-2.jpg",
    },
  ];

  const services: Service[] = [
    {
      icon: <Sun size={20} className="sm:w-6 sm:h-6" />,
      name: "Solar Power",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: <Wifi size={20} className="sm:w-6 sm:h-6" />,
      name: "High-Speed WiFi",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Book size={20} className="sm:w-6 sm:h-6" />,
      name: "Study Rooms",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <Shield size={20} className="sm:w-6 sm:h-6" />,
      name: "24/7 Security",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <Wind size={20} className="sm:w-6 sm:h-6" />,
      name: "AC Rooms",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Users size={20} className="sm:w-6 sm:h-6" />,
      name: "Community Areas",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <Utensils size={20} className="sm:w-6 sm:h-6" />,
      name: "Quality Mess",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Power size={20} className="sm:w-6 sm:h-6" />,
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
    <div className="relative h-full pt-8 sm:pt-12 pb-16 sm:pb-20 px-3 sm:px-4 bg-gray-50 overflow-y-auto">
      {/* <NavigationButtons onNext={onNext} onPrev={onPrev} /> */}

      {/* Hero Slider */}
      <div className="relative h-48 sm:h-64 mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-lg">
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
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-3 sm:p-4">
              <h2 className="text-white text-xl sm:text-2xl font-bold">
                {slides[currentSlide].title}
              </h2>
              <p className="text-white text-xs sm:text-sm mt-1 sm:mt-2">
                {slides[currentSlide].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button className="bg-blue-600 text-white rounded-lg p-3 sm:p-4 shadow-md flex items-center justify-center text-sm sm:text-base">
            <Home size={18} className="mr-2" />
            <span>Book a Room</span>
          </button>
          <button className="bg-green-600 text-white rounded-lg p-3 sm:p-4 shadow-md flex items-center justify-center text-sm sm:text-base">
            <Coffee size={18} className="mr-2" />
            <span>View Amenities</span>
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Our Services
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`${service.color} rounded-lg p-3 sm:p-4 shadow-md flex items-center`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {service.icon}
              <span className="ml-2 sm:ml-3 font-medium text-xs sm:text-base">
                {service.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          What Students Say
        </h2>
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
          <p className="text-gray-600 italic text-sm sm:text-base">
            "Latur Hostel provided me with the perfect environment to focus on
            my studies and make lifelong friends. The amenities are top-notch!"
          </p>
          <p className="text-gray-800 font-semibold mt-2 text-sm sm:text-base">
            - Priya S., Engineering Student
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          Ready to Join Our Community?
        </h2>
        <p className="mb-3 sm:mb-4 text-sm sm:text-base">
          Experience the best of student living at Latur Hostel.
        </p>
        <button className="bg-white text-blue-600 font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full flex items-center text-sm sm:text-base">
          Book Now
          <ChevronRight size={18} className="ml-1.5 sm:ml-2" />
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
    {
      icon: <Home size={16} className="sm:w-5 sm:h-5" />,
      text: "1. Registration Process",
    },

    {
      icon: <Key size={16} className="sm:w-5 sm:h-5" />,
      text: "2. Log in to Your Account",
    },
    {
      icon: <Book size={16} className="sm:w-5 sm:h-5" />,
      text: "3. Explore Hostel Options",
    },
    {
      icon: <ThumbsUp size={16} className="sm:w-5 sm:h-5" />,
      text: "4. Add to Wishlist",
    },
    {
      icon: <Users size={16} className="sm:w-5 sm:h-5" />,
      text: "5. Submit Wishlist for Approval",
    },
    {
      icon: <Calendar size={16} className="sm:w-5 sm:h-5" />,
      text: "6. Schedule Visit to Hostel",
    },
    {
      icon: <MessageCircle size={16} className="sm:w-5 sm:h-5" />,
      text: "7. Provide Feedback",
    },
    {
      icon: <Check size={16} className="sm:w-5 sm:h-5" />,
      text: "8. Take Admission",
    },
    {
      icon: <FileText size={16} className="sm:w-5 sm:h-5" />,
      text: "9. Complete Formalities",
    },
    {
      icon: <HelpCircle size={16} className="sm:w-5 sm:h-5" />,
      text: "10. Follow Hostel Guidelines",
    },
  ];

  useEffect(() => {
    const stepHeight: number = window.innerWidth < 640 ? 50 : 60;
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
    <div className="relative h-full pt-8 sm:pt-12 pb-16 sm:pb-20 px-3 sm:px-4 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* <NavigationButtons onNext={onNext} onPrev={onPrev} /> */}
      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-blue-800">
          Steps to get hostel
        </h1>
      </div>

      {/* Autoplay Slider */}
      <div className="mb-4 sm:mb-6 relative h-16 sm:h-20 rounded-lg overflow-hidden bg-white shadow-lg">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSupportSlide}
            className="absolute inset-0 flex flex-col justify-center items-center p-3 sm:p-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base sm:text-xl font-semibold text-blue-700">
              {supportSlides[currentSupportSlide].title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 text-center">
              {supportSlides[currentSupportSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-blue-800">
        Admission Process
      </h2>

      <div
        ref={stepsRef}
        className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 h-56 sm:h-64 overflow-hidden"
      >
        <div className="space-y-1 sm:space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center py-2 sm:py-3 border-b border-gray-100 last:border-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-3 sm:mr-4">
                {step.icon}
              </div>
              <span className="text-xs sm:text-sm text-gray-700">
                {step.text}
              </span>
              <ChevronRight size={14} className="ml-auto text-blue-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <button className="bg-blue-600 text-white rounded-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center shadow-lg hover:bg-blue-700 transition duration-300">
          <HelpCircle size={14} className="mr-1.5 sm:mr-2" />
          <span>Get Help</span>
        </button>
        <button className="bg-purple-600 text-white rounded-full py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center shadow-lg hover:bg-purple-700 transition duration-300">
          <MessageCircle size={14} className="mr-1.5 sm:mr-2" />
          <span>Raise a Complaint</span>
        </button>
      </div>
    </div>
  );
};

const MobileApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("welcome");
  const [time, setTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  });
  const appRef = useRef(null);
  const screens = ["welcome", "home", "support"];

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);
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

  return (
    <div className="relative flex items-center justify-center  overflow-hidden  p-4">
      <div
        ref={appRef}
        className="relative w-[280px] sm:w-[320px] h-[500px] sm:h-[600px] bg-black rounded-[32px] sm:rounded-[40px] p-2 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="w-full h-full bg-white rounded-[28px] sm:rounded-[35px] overflow-hidden relative">
          {/* Status Bar */}
          <div className="sticky top-0 left-0 right-0 h-[36px] sm:h-[44px] bg-white flex items-center justify-between px-4 sm:px-6 text-black z-30 border-b border-gray-100">
            <span className="text-[10px] sm:text-xs font-semibold">{time}</span>
            <div className="flex items-center space-x-1">
              <div className="w-4 sm:w-6 h-2 sm:h-3 bg-black rounded-sm relative">
                <div className="absolute right-[2px] top-[2px] bottom-[2px] left-[6px] sm:left-[9px] bg-white rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative h-[calc(100%-90px)] bg-gray-50">
            <AnimatePresence initial={false} custom={currentScreen}>
              <motion.div
                key={currentScreen}
                custom={currentScreen}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 p-3 sm:p-4"
              >
                {currentScreen === "welcome" && (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-blue-500 rounded-full animate-pulse"></div>
                    <WelcomeScreen
                      onNext={handleNextScreen}
                      onPrev={handlePrevScreen}
                    />
                  </div>
                )}
                {currentScreen === "support" && (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-500 rounded-full animate-bounce"></div>
                    <SupportScreen
                      onNext={handleNextScreen}
                      onPrev={handlePrevScreen}
                    />
                  </div>
                )}
                {currentScreen === "home" && (
                  <div className="h-full flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                    <HomeScreen
                      onNext={handleNextScreen}
                      onPrev={handlePrevScreen}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-2 left-2 right-2 h-[50px] sm:h-[60px] bg-gray-800 rounded-[25px] sm:rounded-[30px] flex justify-around items-center shadow-lg">
            <button
              aria-label="Home"
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Home size={20} className="text-white" />
            </button>
            <button
              aria-label="Coffee Break"
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Coffee size={20} className="text-white" />
            </button>
            <button
              aria-label="Lock Screen"
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center -mt-4 sm:-mt-6 hover:bg-gray-600 transition-colors shadow-lg"
            >
              <Lock size={20} className="text-white" />
            </button>
            <button
              aria-label="Layout Settings"
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Layout size={20} className="text-white" />
            </button>
            <button
              aria-label="Additional Coffee"
              className="p-1.5 sm:p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <Coffee size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
