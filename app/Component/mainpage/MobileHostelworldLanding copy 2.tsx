import React, { useEffect, useState } from "react";
import { Search, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardProps {
  title: string;
  imageSrc: string;
}

const Card: React.FC<CardProps> = ({ title, imageSrc }) => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-r from-sky-300 to-sky-100 rounded-lg shadow-lg overflow-hidden mb-4 transform hover:scale-105 transition-all duration-300 group relative  h-36 md:h-30 md:bg-white">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 md:bg-none"></div>
      <div className="flex h-full">
        <div className="w-1/2 p-4 flex flex-col justify-center relative z-20">
          <h3 className="text-sm md:text-lg font-semibold group-hover:text-sky-700 transition-colors duration-300">
            {title}
          </h3>
          <button className="mt-2 self-start p-2 rounded-full bg-sky-100 group-hover:bg-white transition-colors duration-300">
            <ArrowRight
              size={16}
              className="text-sky-500 group-hover:text-sky-700"
              onClick={() => router.push("/oldlogin")}
            />
          </button>
        </div>
        <div className="w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-sky-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent z-20"></div>
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
};

interface SlideContent {
  title: string;
  description: string;
  imageSrc: string;
}

const slideContents: SlideContent[] = [
  {
    title: "Hygiene Standards",
    description:
      "A Sanitized Sanctuary. Peace of Mind, Always. Hassle-Free Travel.",
    imageSrc: "/Images/hygine.avif",
  },
  {
    title: "Welcome to Latur Hostel",
    description:
      "Experience the warmth and comfort of home. Latur Hostel offers a welcoming environment with modern amenities, ensuring you feel relaxed and cared for throughout your stay.",
    imageSrc: "/Images/hostelai.webp",
  },
  {
    title: "Security Features",
    description:
      "Your safety, our utmost priority. Equipped with 24/7 surveillance and advanced security measures for your protection.",
    imageSrc: "/Images/security.jpeg",
  },

  {
    title: "Pick-up and Drop-off Point",
    description:
      "Seamless, affordable luxury. Convenient amenities ensure a smooth travel experience, from arrival to departure.",
    imageSrc: "/Images/pick.avif",
  },
  {
    title: "Welcome to Latur Hostel",
    description:
      "Experience the warmth and comfort of home. Latur Hostel offers a welcoming environment with modern amenities, ensuring you feel relaxed and cared for throughout your stay.",
    imageSrc: "/Images/hostelai.webp",
  },
];

const ContentCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideContents.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slideContents.length) % slideContents.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-8/12   rounded-lg overflow-hidden relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slideContents.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <div className="relative">
              <img
                src={slide.imageSrc}
                alt={slide.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-blue p-8 max-w-2xl">
                  <h1 className="text-5xl font-bold mb-4 leading-tight text-white">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-white">{slide.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
      >
        <ArrowLeft size={24} className="text-sky-500" />
      </button>
      {/* <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors duration-300"
      > */}
      {/* <ArrowRight size={24} className="text-sky-500" />
      </button> */}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slideContents.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-colors duration-300 border-2 border-sky-500 ${
              index === currentSlide ? "bg-white" : "bg-transparent"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const HousingLandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="bg-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row relative">
        <div className="w-full ml-60 md:w-12/12 mb-8 md:mb-0">
          <ContentCarousel />
        </div>

        <div className=" md:w-1/4 md:absolute md:right-0 md:top-1/2 md:transform md:-translate-y-1/2 md:z-20">
          <div className="md:ml-[-50%]">
            {/* Mobile view: Cards stacked vertically */}
            <div className="md:hidden space-y-4">
              <Card title="I'm Student" imageSrc="/Images/student.avif" />
              <Card title="I'm HostelOwner" imageSrc="/Images/owner.jpg" />
            </div>

            {/* Desktop view: Cards stacked vertically */}
            <div className="hidden md:block">
              <Card title="I'm Student" imageSrc="/Images/student.avif" />
              <Card title="I'm HostelOwner" imageSrc="/Images/owner.jpg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingLandingPage;
