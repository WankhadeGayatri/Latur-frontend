"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import HostelCard from "./HostelCard";

import { useSearchParams } from "next/navigation";

import { API_BASE_URL } from "../../../config/api";
import FilterBar from "./FilterBar";
import Head from "next/head";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Pagination,
} from "@mui/material";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Linkedin,
  Youtube,
  Wifi,
  Coffee,
  Book,
  Sun,
  Utensils,
} from "lucide-react";
import Lottie from "lottie-react";
import wait from "../../../public/wait.json";
import { Facebook, Instagram } from "@mui/icons-material";
import Image from "next/image";
import ContactPage from "./ContactPage";
import ImageGallery from "./ImageGallary";

import MobileApp from "./MobileApp";

import Footer from "./Footer";
import WavePromoBanner from "./WavePromoBanner";
import CanvaGifEmbed from "./CanvaGifEmbed";
import MobileHostelworldLanding from "./MobileHostelworldLanding";
import HostelGallery from "./HostelGallery";
import dynamic from "next/dynamic";
import CoverflowSlider from "./CoverflowSlider";
const CenteredFeatureSlider = dynamic(() => import("./CenterFeatureSlider"), {
  ssr: false,
});

// Updated Hostel interface
interface Hostel {
  _id: string;
  name: string;
  owner: string;
  number: string;
  address: string;
  hostelType: string;
  beds: number;
  studentsPerRoom: number;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  images: {
    contentType: string;
    data: string;
  }[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  verified: boolean;
  paymentStatus: string;
  pendingVisits: {
    student: string;
    visitDate: Date;
    visitTime: string;
  }[];
  rentStructure: {
    studentsPerRoom: number;
    rentPerStudent: number;
  }[];
  feedback: {
    student: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
  complaints: {
    student: string;
    description: string;
    isAnonymous: boolean;
    images: {
      data: string;
      contentType: string;
    }[];
    date: Date;
    status: string;
    complaintType: string;
  }[];
  latitude: number;
  longitude: number;
}

// HostelCard props interface
interface HostelCardProps {
  id: string;
  images: Hostel["images"];
  name: string;
  owner: string;
  number: string;
  address: string;
  hostelType: string;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  beds: number;
  studentsPerRoom: number;
  rentStructure: Hostel["rentStructure"];
  isVerified: boolean;
  feedback: Hostel["feedback"];
  ratings: number;
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  paymentStatus: string;
  pendingVisits: Hostel["pendingVisits"];
  complaints: Hostel["complaints"];
  onWishlistToggle: (id: string, isInWishlist: boolean) => void;
}

interface Filters {
  searchName: string;
  type: string;
  studentsPerRoom: string;
  food: boolean;
  verified: boolean;
  sortByRatings: boolean;
  rentRange: [number, number];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
}

interface GalleryImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [filteredHostels, setFilteredHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    searchName: "",
    type: "All",
    studentsPerRoom: "Any",
    food: false,
    verified: false,
    sortByRatings: false,
    rentRange: [0, 10000],
    wifi: false,
    ac: false,
    mess: false,
    solar: false,
    studyRoom: false,
    tuition: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 10;

  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hostelListRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const sliderItems = [
    {
      src: "/Images/HomePage/Hostel9.avif",
      alt: "Hostel 1",
      name: "Unicorn",
      price: 3000,
      rating: 4.5,
    },
    {
      src: "/Images/HomePage/Hostel2.avif",
      alt: "Hostel 2",
      name: "Prime 13",
      price: 4999,
      rating: 4.2,
    },
    {
      src: "/Images/HomePage/Hostel2.avif",
      alt: "Hostel 3",
      name: "Heros Room",
      price: 9999,
      rating: 4.1,
    },
    {
      src: "/Images/HomePage/Hostel3.avif",
      alt: "Hostel 4",
      name: "Kaveri Nest",
      price: 8999,
      rating: 4.4,
    },
    {
      src: "/Images/HomePage/Hostel4.avif",
      alt: "Hostel 5",
      name: "Aspiration",
      price: 7999,
      rating: 4.3,
    },
    {
      src: "/Images/HomePage/Hostel5.avif",
      alt: "Hostel 6",
      name: "Inspiration",
      price: 4999,
      rating: 4.2,
    },
    {
      src: "/Images/HomePage/Hostel8.avif",
      alt: "Hostel 7",
      name: "Ram Ratan",
      price: 8999,
      rating: 4.0,
    },
    {
      src: "/Images/HomePage/Hostel7.avif",
      alt: "Hostel 8",
      name: "Geeta Hostel",
      price: 1999,
      rating: 3.5,
    },

    {
      src: "/Images/HomePage/Hostel3.avif",
      alt: "Hostel 9",
      name: "Stay Stree",
      price: 4999,
      rating: 4.0,
    },
    {
      src: "/Images/HomePage/Hostel8.avif",
      alt: "Hostel 8",
      name: "Left Wing",
      price: 3999,
      rating: 3.8,
    },
    // Add more items as needed
  ];
  const fetchHostels = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/hostels/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const hostelsWithPhotos = await Promise.all(
        data.map(async (hostel: Hostel) => {
          try {
            const photoResponse = await fetch(
              `${API_BASE_URL}/api/hostels/gethostalphotos/${hostel._id}`
            );
            if (!photoResponse.ok) {
              throw new Error(`HTTP error! status: ${photoResponse.status}`);
            }
            const photos = await photoResponse.json();
            return {
              ...hostel,
              images: photos,
              id: hostel._id,
              latitude: hostel.latitude || 0,
              longitude: hostel.longitude || 0,
            };
          } catch (photoError) {
            console.error("Error fetching hostel photos:", photoError);
            return {
              ...hostel,
              images: [],
              id: hostel._id,
              latitude: hostel.latitude || 0,
              longitude: hostel.longitude || 0,
            };
          }
        })
      );

      setHostels(hostelsWithPhotos);
      setFilteredHostels(hostelsWithPhotos);
    } catch (error) {
      console.error("Error fetching hostels:", error);
      setError("Error fetching hostels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);
  const criticalCSS = `
  .MuiToolbar-root {
    height: 60px;
    min-height: 60px;
  }
  /* Add other critical styles here */
`;

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setFilters((prevFilters) => ({ ...prevFilters, searchName: query }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (filterRef.current) {
      const filterHeight = filterRef.current.offsetHeight;
      document.body.style.paddingTop = `${filterHeight}px`;
    }
  }, []);

  const handleFilter = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const LoaderComponent: React.FC = () => {
    return <div>Searching Hostels</div>;
  };

  const NoHostelsFound: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-64"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 mb-4"
        animate={{
          rotate: [0, 10, -10, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </motion.svg>
      <motion.h2
        className="text-2xl font-semibold text-gray-700 mb-2"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        No Hostels Found
      </motion.h2>
      <p className="text-gray-500">
        Try adjusting your filters or search criteria.
      </p>
    </motion.div>
  );

  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = filteredHostels.slice(
    indexOfFirstHostel,
    indexOfLastHostel
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback((query: string, location: string) => {
    setFilters((prev) => ({ ...prev, searchName: query }));

    // Scroll to the hostel list after a short delay to allow for filtering
    setTimeout(() => {
      if (hostelListRef.current) {
        hostelListRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (hostels.length > 0) {
      let result = hostels;

      // Apply all filters
      if (filters.searchName.trim() !== "") {
        const searchLower = filters.searchName.toLowerCase();
        result = result.filter(
          (hostel) =>
            hostel.name.toLowerCase().includes(searchLower) ||
            hostel.address.toLowerCase().includes(searchLower) ||
            hostel.owner.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type !== "All") {
        result = result.filter(
          (hostel) =>
            hostel.hostelType.toLowerCase() === filters.type.toLowerCase()
        );
      }

      if (filters.studentsPerRoom !== "Any") {
        const studentsPerRoom = parseInt(filters.studentsPerRoom);
        result = result.filter((hostel) => {
          if (studentsPerRoom === 3) {
            return hostel.studentsPerRoom >= 3;
          }
          return hostel.studentsPerRoom === studentsPerRoom;
        });
      }

      if (filters.food) {
        result = result.filter((hostel) => hostel.food);
      }

      if (filters.verified) {
        result = result.filter((hostel) => hostel.verified);
      }

      if (filters.rentRange[0] > 0 || filters.rentRange[1] < 10000) {
        result = result.filter((hostel) => {
          const lowestRent = Math.min(
            ...hostel.rentStructure.map((r) => r.rentPerStudent)
          );
          return (
            lowestRent >= filters.rentRange[0] &&
            lowestRent <= filters.rentRange[1]
          );
        });
      }

      // Apply new filters
      if (filters.wifi) result = result.filter((hostel) => hostel.wifi);
      if (filters.ac) result = result.filter((hostel) => hostel.ac);
      if (filters.mess) result = result.filter((hostel) => hostel.mess);
      if (filters.solar) result = result.filter((hostel) => hostel.solar);
      if (filters.studyRoom)
        result = result.filter((hostel) => hostel.studyRoom);
      if (filters.tuition) result = result.filter((hostel) => hostel.tuition);

      if (filters.sortByRatings) {
        result.sort((a, b) => {
          const ratingA =
            a.feedback.reduce((sum, f) => sum + f.rating, 0) /
              a.feedback.length || 0;
          const ratingB =
            b.feedback.reduce((sum, f) => sum + f.rating, 0) /
              b.feedback.length || 0;
          return ratingB - ratingA;
        });
      }

      setFilteredHostels(result);
      setCurrentPage(1);
    }
  }, [hostels, filters]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const checkScroll = () => {
      if (hostelListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = hostelListRef.current;
        setShowScrollIndicator(scrollTop + clientHeight < scrollHeight - 20);
      }
    };

    const listElement = hostelListRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", checkScroll);
      checkScroll(); // Check initially
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", checkScroll);
      }
    };
  }, [currentHostels]);

  const amenities = [
    { icon: Wifi, label: "Free Wi-Fi" },
    { icon: Coffee, label: "Study Room" },
    { icon: Book, label: "Library" },
    { icon: Sun, label: "Solar Powered" },
    { icon: Utensils, label: "Mess Facility" },
    // { icon: AirConditioning, label: 'AC Rooms' },
  ];

  const AmenitiesSliderLoader = () => {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm">
        <div className="flex space-x-6 overflow-x-auto pb-2">
          {amenities.map((amenity, index) => (
            <motion.div
              key={amenity.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="bg-white p-2 rounded-full shadow-md"
                animate={{
                  scale: [1, 1.1, 1],
                  borderColor: ["#4F46E5", "#818CF8", "#4F46E5"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: index * 0.2,
                }}
                style={{ border: "2px solid #4F46E5" }}
              >
                <amenity.icon className="w-6 h-6 text-indigo-600" />
              </motion.div>
              <p className="mt-1 text-xs font-medium text-indigo-800">
                {amenity.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <link rel="preload" href="/css/4ebd156d80596fe3.css" as="style" />
        <link rel="preload" href="/css/6940938c9d0594bd.css" as="style" />
        <link rel="preload" href="/css/4a5f3d9e576ed0f5.css" as="style" />
        <link
          rel="preload"
          href="/fonts/your-main-font.woff2"
          as="font"
          type="font/woff2"
        />
      </Head>
      <WavePromoBanner text="Welcome to our Latur Hostel Management ! Book your stay now and get 20% off!" />
      <div className="sticky mt-1 top-0 z-10 bg-white">
        <MobileHostelworldLanding onSearch={handleSearch} />
        <Suspense fallback={<AmenitiesSliderLoader />}>
          <CenteredFeatureSlider />
        </Suspense>
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      {isLoading ? (
        <LoaderComponent />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 md:order-2 mb-8 md:mb-0">
              <MobileApp />
            </div>
            <div className="w-full md:w-2/3 md:order-1 relative">
              <div
                ref={hostelListRef}
                className="overflow-y-auto"
                style={{ height: "calc(150vh - 220px)" }}
              >
                <AnimatePresence>
                  {currentHostels.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {currentHostels.map((hostel, index) => (
                        <motion.div
                          key={hostel._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className=" rounded-lg shadow-lg overflow-hidden"
                          style={{ minHeight: "200px" }}
                        >
                          <HostelCard
                            id={hostel._id}
                            images={hostel.images}
                            name={hostel.name}
                            owner={hostel.owner}
                            number={hostel.number}
                            address={hostel.address}
                            hostelType={hostel.hostelType}
                            food={hostel.food}
                            foodType={hostel.foodType}
                            mealOptions={hostel.mealOptions}
                            beds={hostel.beds}
                            studentsPerRoom={hostel.studentsPerRoom}
                            rentStructure={hostel.rentStructure}
                            isVerified={hostel.verified}
                            feedback={hostel.feedback}
                            ratings={
                              hostel.feedback.reduce(
                                (sum, f) => sum + f.rating,
                                0
                              ) / hostel.feedback.length || 0
                            }
                            wifi={hostel.wifi}
                            ac={hostel.ac}
                            mess={hostel.mess}
                            solar={hostel.solar}
                            studyRoom={hostel.studyRoom}
                            tuition={hostel.tuition}
                            paymentStatus={hostel.paymentStatus}
                            pendingVisits={hostel.pendingVisits}
                            complaints={hostel.complaints}
                            onWishlistToggle={(id, isInWishlist) => {
                              console.log(
                                `Toggled wishlist for ${id}: ${isInWishlist}`
                              );
                            }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <NoHostelsFound />
                  )}
                </AnimatePresence>
              </div>
              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
              <div className="mt-8 flex justify-center">
                <Pagination
                  count={Math.ceil(filteredHostels.length / hostelsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <div
        className="container mx-auto px-4 py-8 sm:px-6 lg:px-8"
        style={{
          background: "linear-gradient(to right, #48cae4, #0077b6)",
          borderRadius: "8px",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:gap-0">
         
          <div className="w-full lg:w-3/5 mb-8 lg:mb-0">
            <div className="aspect-w-16 aspect-h-9 h-full max-h-[500px]">
              <CanvaGifEmbed
                designId="DAGRmV0CHqA/4SVTo8vxN2RU2Rv3m2e_Tw"
                title=""
              />
            </div>
          </div>

         
          <div className="w-full lg:w-2/5 lg:pl-8">
            <ContactPage />
          </div>
        </div>
      </div> */}

      <main className="container  mt-10 mx-auto" ref={galleryRef}>
        <h1 className="text-2xl font-bold ">Our Hostel Gallery</h1>
        <div className="image-gallery">
          <CoverflowSlider items={sliderItems} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
