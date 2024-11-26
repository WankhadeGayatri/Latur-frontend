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

import Image from "next/image";

import MobileApp from "./MobileApp";

import Footer from "./Footer";
import WavePromoBanner from "./WavePromoBanner";

import MobileHostelworldLanding from "./MobileHostelworldLanding";

import dynamic from "next/dynamic";
import CoverflowSlider from "./CoverflowSlider";
import InfiniteCardCarousel from "./InfiniteCardCarousel";
import Gallery from "./Gallery";
import LoaderComponent from "./LoaderComponent";
import HostelCardLoader from "./HostelCardLoader";
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
interface PaginatedResponse {
  hostels: Hostel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
interface PaginationState {
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
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
  const [prefetchedData, setPrefetchedData] = useState<Hostel[] | null>(null);
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

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    hasMore: true,
    isLoading: false,
  });

  // Keep existing refs...
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hostelsPerPage = 10;
  const searchParams = useSearchParams();
  const filterRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hostelListRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const searchParams1 = useSearchParams();
  const sliderItems = [
    // {
    //   src: "/Images/HomePage/Hostel7.avif",
    //   alt: "Hostel 8",
    //   name: "Geeta Hostel",
    //   price: 1999,
    //   rating: 3.5,
    // },
    {
      src: "/Images/HomePage/Hostel6.avif",
      alt: "Hostel 8",
      name: "Geeta Hostel",
      price: 1999,
      rating: 3.5,
    },
    {
      src: "/Images/HomePage/Hostel9.avif",
      alt: "Hostel 5",
      name: "Aspiration",
      price: 7999,
      rating: 4.3,
    },
    {
      src: "/Images/HomePage/Hostel8.avif",
      alt: "Hostel 8",
      name: "Geeta Hostel",
      price: 1999,
      rating: 3.5,
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

  const fetchHostels = useCallback(
    async (page: number, isPrefetch: boolean = false) => {
      try {
        if (!isPrefetch) {
          setPagination((prev) => ({ ...prev, isLoading: true }));
        }

        // Build query parameters (keep existing logic)
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          search: filters.searchName,
          type: filters.type !== "All" ? filters.type : "",
          studentsPerRoom:
            filters.studentsPerRoom !== "Any" ? filters.studentsPerRoom : "",
          minRent: filters.rentRange[0].toString(),
          maxRent: filters.rentRange[1].toString(),
        });

        // Keep existing amenities logic
        const selectedAmenities = [];
        if (filters.wifi) selectedAmenities.push("wifi");
        if (filters.ac) selectedAmenities.push("ac");
        if (filters.mess) selectedAmenities.push("mess");
        if (filters.solar) selectedAmenities.push("solar");
        if (filters.studyRoom) selectedAmenities.push("studyRoom");
        if (filters.tuition) selectedAmenities.push("tuition");

        if (selectedAmenities.length > 0) {
          queryParams.append("amenities", selectedAmenities.join(","));
        }

        const response = await fetch(
          `${API_BASE_URL}/api/hostels/all?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (isPrefetch) {
          setPrefetchedData(data.hostels);
        } else {
          setHostels((prev) =>
            page === 1 ? data.hostels : [...prev, ...data.hostels]
          );
          // Prefetch next page
          if (data.hostels.length === hostelsPerPage) {
            fetchHostels(page + 1, true);
          }
          setPagination((prev) => ({
            ...prev,
            hasMore: data.hostels.length === hostelsPerPage,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Error fetching hostels:", error);
        setError("Error fetching hostels");
        if (!isPrefetch) {
          setPagination((prev) => ({
            ...prev,
            isLoading: false,
            hasMore: false,
          }));
          // Ensure hostels is set to an empty array if fetch fails
          setHostels([]);
        }
      }
    },
    [filters]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setPagination({
      currentPage: 1,
      hasMore: true,
      isLoading: false,
    });
    fetchHostels(1);
  }, [filters, fetchHostels]);
  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          pagination.hasMore &&
          !pagination.isLoading
        ) {
          setPagination((prev) => ({
            ...prev,
            currentPage: prev.currentPage + 1,
          }));
          fetchHostels(pagination.currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [
    pagination.hasMore,
    pagination.isLoading,
    fetchHostels,
    pagination.currentPage,
  ]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setCurrentPage(value);
      if (prefetchedData && value === pagination.currentPage + 1) {
        // Use prefetched data
        setHostels(prefetchedData);
        setPrefetchedData(null);
        setPagination((prev) => ({
          ...prev,
          currentPage: value,
        }));
        // Prefetch next page
        fetchHostels(value + 1, true);
      } else {
        // Fetch new data
        fetchHostels(value);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pagination.currentPage, prefetchedData, fetchHostels]
  );

  const criticalCSS = `
  .MuiToolbar-root {
    height: 60px;
    min-height: 60px;
  }
  /* Add other critical styles here */
`;

  useEffect(() => {
    if (filterRef.current) {
      const filterHeight = filterRef.current.offsetHeight;
      document.body.style.paddingTop = `${filterHeight}px`;
    }
  }, []);

  const handleFilter = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

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

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback((query: string, location: string) => {
    // Normalize search terms
    let searchQuery = query.toLowerCase();

    // Handle common variations of gender searches
    const girlsTerms = [
      "girl",
      "girls",
      "girlshostel",
      "girlhostel",
      "girls hostel",
      "girl hostel",
    ];
    const boysTerms = [
      "boy",
      "boys",
      "boyshostel",
      "boyhostel",
      "boys hostel",
      "boy hostel",
    ];

    // Check if search includes gender terms and standardize them
    const isGirlsSearch = girlsTerms.some((term) => searchQuery.includes(term));
    const isBoysSearch = boysTerms.some((term) => searchQuery.includes(term));

    // Set filters
    setFilters((prev) => ({
      ...prev,
      searchName: query,
      type: isGirlsSearch ? "girls" : isBoysSearch ? "boys" : prev.type,
    }));

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
        const searchTerms = filters.searchName.toLowerCase().split(" ");
        result = result.filter((hostel) => {
          return searchTerms.some((term) => {
            // Check for name, address, and owner matches
            const matchesBasic =
              hostel.name.toLowerCase().includes(term) ||
              hostel.address.toLowerCase().includes(term) ||
              hostel.owner.toLowerCase().includes(term);

            // Enhanced gender matching
            const isGirlsSearch =
              term === "girls" ||
              term === "girl" ||
              term === "girlshostel" ||
              term === "girlhostel";

            const isBoysSearch =
              term === "boys" ||
              term === "boy" ||
              term === "boyshostel" ||
              term === "boyhostel";

            const matchesGender =
              (isGirlsSearch && hostel.hostelType.toLowerCase() === "girls") ||
              (isBoysSearch && hostel.hostelType.toLowerCase() === "boys");

            return matchesBasic || matchesGender;
          });
        });
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
    } else {
      setFilteredHostels([]);
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
      <div className="sticky top-0 z-10 bg-white">
        <MobileHostelworldLanding onSearch={handleSearch} />
        <Suspense fallback={<AmenitiesSliderLoader />}>
          <CenteredFeatureSlider />
        </Suspense>
        <FilterBar
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
      </div>

      <div className="container px-4">
        <div className="flex flex-col md:flex-row md:gap-6">
          {/* Mobile App - Fixed position on desktop - Always visible */}
          <div className="hidden md:block w-full md:w-1/3 md:order-2">
            <div className="sticky mt-12">
              <MobileApp />
            </div>
          </div>

          {/* Mobile View of MobileApp - Always visible */}
          <div className="md:hidden w-full mb-6">
            <MobileApp />
          </div>

          {/* Hostel List - Scrollable on desktop */}
          <div className="w-full md:w-2/3 md:order-1">
            <div className="md:h-[calc(150vh-280px)] md:overflow-y-auto md:pr-4 md:scroll-smooth">
              {isLoading && pagination.isLoading ? (
                <>
                  <HostelCardLoader />
                  <HostelCardLoader />
                  <HostelCardLoader />
                </>
              ) : (
                <AnimatePresence>
                  {hostels.length > 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {hostels.map((hostel, index) => (
                        <motion.div
                          key={`${hostel._id}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.1, 0.5) }}
                          className="rounded-lg shadow-lg overflow-hidden bg-white"
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

                      {/* Infinite scroll loader */}
                      <div ref={loadingRef} className="py-4">
                        {pagination.isLoading && (
                          <div className="flex justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <NoHostelsFound />
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isLoading && filteredHostels.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={Math.ceil(filteredHostels.length / hostelsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      )}
      <motion.section
        id="gallery"
        className="py-8 md:py-12 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center relative">
            Our Hostel Gallery
            <span className="block h-1 w-24 bg-blue-500 mx-auto mt-2"></span>
          </h1>

          <div className="mt-8 md:mt-12">
            <InfiniteCardCarousel items={sliderItems} />
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
};
export default HomePage;
