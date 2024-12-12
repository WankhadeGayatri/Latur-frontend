"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Filter,
  ChevronDown,
  Search,
  MapPin,
  X,
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
  onSearch: (query: string, location: string) => void;
}

// Add this style block at the top of your component
const styles = `
  .filter-dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  z-index: 50;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .filter-button:hover + .filter-dropdown,
  .filter-dropdown:hover {
  display: block;
  }
  
  .filter-option:hover {
  background-color: #87CEEB;
  color: white;
  }`;

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

interface FilterOptions {
  Type: string[];
  "Students/Room": string[];
  "Preferred By": string[];
}

const filterOptions: FilterOptions = {
  Type: ["All", "boys", "girls", "cowed"],
  "Students/Room": ["Any", "1", "2", "3+"],
  "Preferred By": ["Students", "Working Professionals", "Both"],
};

const initialFilters: Filters = {
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
};

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSearch }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const filterButtons = Object.keys(filterOptions) as (keyof FilterOptions)[];
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleDropdown = (filter: string) => {
    setOpenDropdown(openDropdown === filter ? null : filter);
  };

  const handleFilterSelect = (filter: keyof FilterOptions, option: string) => {
    switch (filter) {
      case "Type":
        handleFilterChange("type", option);
        break;
      case "Students/Room":
        handleFilterChange("studentsPerRoom", option);
        break;
    }
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    onSearch(searchQuery, "");
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };
  const renderSearchBar = () => (
    <div
      className={`relative flex-shrink-0 ${
        deviceType === "mobile"
          ? "w-full"
          : deviceType === "tablet"
          ? "w-[250px]"
          : "w-[300px]"
      }`}
    >
      <input
        type="text"
        placeholder="Search your Hostel"
        className="w-full bg-white border-2 border-sky-200 rounded-full py-3 px-5 pr-12 text-base focus:outline-none focus:border-sky-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sky-500 hover:text-sky-600"
      >
        <Search size={24} aria-label="search" />
      </button>
    </div>
  );

  // Modified filter buttons with responsive sizes
  const renderFilterButtons = () => {
    return (
      <>
        {filterButtons.map((filter) => (
          <div
            key={filter}
            className="relative group"
            onMouseEnter={() => setActiveDropdown(filter)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`filter-button flex items-center justify-between px-4 py-2 
                       text-sm hover:bg-[#87CEEB] hover:text-white rounded-full border-2 
                       border-gray-300 ${
                         deviceType === "tablet" ? "w-36" : "w-44"
                       } h-12`}
            >
              <span className="truncate">
                {filter}:{" "}
                {filter === "Type"
                  ? filters.type
                  : filter === "Students/Room"
                  ? filters.studentsPerRoom
                  : "Any"}
              </span>
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 
                ${activeDropdown === filter ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`
              absolute z-10 w-full border border-gray-200 bg-white 
              shadow-lg rounded-md mt-1 overflow-hidden
              ${activeDropdown === filter ? "block" : "hidden"}
              group-hover:block
            `}
            >
              {filterOptions[filter as keyof FilterOptions].map(
                (option, index) => (
                  <div
                    key={index}
                    className="filter-option px-4 py-2 text-sm cursor-pointer 
                           hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      handleFilterSelect(filter, option);
                      setActiveDropdown(null);
                    }}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </>
    );
  };

  const renderDesktopFilters = () => (
    <>
      {filterButtons.map((filter) => (
        <div key={filter} className="relative">
          <button
            onClick={() => toggleDropdown(filter)}
            className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[#87CEEB] hover:text-white rounded-full border-2 border-gray-300 w-44 h-12"
          >
            <span className="truncate">
              {filter}:{" "}
              {filter === "Type"
                ? filters.type
                : filter === "Students/Room"
                ? filters.studentsPerRoom
                : "Any"}
            </span>
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                openDropdown === filter ? "transform rotate-180" : ""
              }`}
            />
          </button>
          {openDropdown === filter && (
            <div className="absolute z-10 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-lg">
              {filterOptions[filter].map((option, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm hover:bg-[#87CEEB] hover:text-white cursor-pointer"
                  onClick={() => handleFilterSelect(filter, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 text-sm rounded-full border-2 border-gray-300 w-40 h-12"
      >
        <Filter className="w-4 h-4 mr-2" />
        More Filters
      </button>

      <button
        onClick={() =>
          handleFilterChange("sortByRatings", !filters.sortByRatings)
        }
        className="flex items-center px-4 py-2 text-sm rounded-full border-2 border-gray-300 w-40 h-12"
      >
        Sort By:{" "}
        <span className="text-[#4A7E8E] ml-1">
          {filters.sortByRatings ? "Ratings" : "Popularity"}
        </span>
      </button>

      <button
        onClick={clearAllFilters}
        className="flex items-center px-4 py-2 text-sm rounded-full border-2 border-red-300 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-300 w-40 h-12"
      >
        <X className="w-4 h-4 mr-2" />
        Clear Filters
      </button>
    </>
  );

  const renderMobileFilters = () => {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          {/* Left side with search and filters */}
          <div className="flex items-center space-x-2 flex-grow">
            {isSearchExpanded ? (
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search your Hostel"
                  className="w-full bg-white border-2 border-sky-200 rounded-full py-2 px-4 pr-10 text-sm focus:outline-none focus:border-sky-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  aria-label="Search"
                  onClick={() => {
                    handleSearch();
                    setIsSearchExpanded(false);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sky-500 hover:text-sky-600"
                >
                  <Search size={20} aria-label="search" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchExpanded(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-100"
              >
                <Search size={20} aria-label="search" />
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 text-sm rounded-full border-2 border-gray-300 h-10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <div className="relative">
              <button
                onClick={() => setIsGenderOpen(!isGenderOpen)}
                className="flex items-center justify-between px-4 py-2 text-sm rounded-full border-2 border-gray-300 h-10 min-w-[110px]"
              >
                <span className="truncate">
                  {filters.type === "All"
                    ? "Gender"
                    : filters.type === "boys"
                    ? "Male"
                    : "Female"}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              {isGenderOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border-2 border-gray-300 rounded-lg shadow-lg">
                  {["All", "boys", "girls"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleFilterChange("type", option);
                        setIsGenderOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        filters.type === option
                          ? "bg-[#87CEEB] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {option === "All"
                        ? "All"
                        : option === "boys"
                        ? "Male"
                        : "Female"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isSticky && (
            <div className="flex items-center ml-2">
              <Navbar />
            </div>
          )}
        </div>
      </div>
    );
  };
  useEffect(() => {
    const filterBar = filterBarRef.current;
    if (!filterBar) return;

    let filterBarTop =
      filterBar.getBoundingClientRect().top + window.pageYOffset;

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsSticky(scrollPosition > filterBarTop);
    };

    const handleResize = () => {
      if (filterBar) {
        filterBarTop =
          filterBar.getBoundingClientRect().top + window.pageYOffset;
      }

      // Enhanced responsive breakpoints
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
        setIsMobile(true);
      } else if (width >= 768 && width <= 1024) {
        setDeviceType("tablet");
        setIsMobile(false); // Keep desktop layout for tablet but with adjustments
      } else {
        setDeviceType("desktop");
        setIsMobile(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Initial device check
    handleResize();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>

      <div
        ref={filterBarRef}
        className={`p-4 md:p-6 bg-white transition-all duration-300 ${
          isSticky ? "fixed top-0 left-0 right-0 z-50 shadow-md" : ""
        }`}
        style={{
          position: isSticky ? "fixed" : "static",
          top: isSticky ? "0" : "auto",
          left: 0,
          right: 0,
        }}
      >
        <div
          className={`
          flex items-center
          ${
            deviceType === "mobile"
              ? "flex-col items-stretch space-y-4"
              : deviceType === "tablet"
              ? "flex-wrap gap-3 justify-center"
              : "space-x-6 justify-center"
          }
        `}
        >
          {deviceType !== "mobile" && renderSearchBar()}
          {deviceType === "mobile" ? (
            renderMobileFilters()
          ) : (
            <>
              {renderFilterButtons()}
              <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center px-4 py-2 text-sm rounded-full border-2 border-gray-300 ${
                  deviceType === "tablet" ? "w-32" : "w-40"
                } h-12`}
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
              <button
                onClick={() =>
                  handleFilterChange("sortByRatings", !filters.sortByRatings)
                }
                className={`flex items-center px-4 py-2 text-sm rounded-full border-2 border-gray-300 ${
                  deviceType === "tablet" ? "w-32" : "w-40"
                } h-12`}
              >
                Sort By:{" "}
                <span className="text-[#4A7E8E] ml-1">
                  {filters.sortByRatings ? "Ratings" : "Popularity"}
                </span>
              </button>
              <button
                onClick={clearAllFilters}
                className={`flex items-center px-4 py-2 text-sm rounded-full border-2 border-red-100 text-red-#EC130F hover:bg-red-200 hover:text-white transition-colors duration-300 ${
                  deviceType === "tablet" ? "w-32" : "w-40"
                } h-12`}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </>
          )}
        </div>

        {isModalOpen && !isMobile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-lg w-[400px] max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">More Filters</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "food",
                    "wifi",
                    "ac",
                    "mess",
                    "solar",
                    "studyRoom",
                    "tuition",
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters[amenity as keyof Filters] as boolean}
                        onChange={(e) =>
                          handleFilterChange(
                            amenity as keyof Filters,
                            e.target.checked
                          )
                        }
                      />
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Rent Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.rentRange[1]}
                  onChange={(e) =>
                    handleFilterChange("rentRange", [
                      0,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span>₹0</span>
                  <span>₹{filters.rentRange[1]}</span>
                </div>
              </div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.verified}
                  onChange={(e) =>
                    handleFilterChange("verified", e.target.checked)
                  }
                />
                Verified Only
              </label>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#87CEEB] text-white px-4 py-2 rounded-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
        {isModalOpen && isMobile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end z-50">
            <div
              ref={modalRef}
              className="bg-white p-6 rounded-t-lg w-full max-h-[80vh] overflow-y-auto transition-transform duration-300 transform translate-y-0"
              style={{
                transform: isModalOpen ? "translateY(0)" : "translateY(100%)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              {filterButtons.map((filter) => (
                <div key={filter} className="mb-4">
                  <h3 className="font-semibold mb-2">{filter}</h3>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions[filter].map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleFilterSelect(filter, option)}
                        className={`px-4 py-2 text-sm rounded-full border ${
                          (filter === "Type" && filters.type === option) ||
                          (filter === "Students/Room" &&
                            filters.studentsPerRoom === option)
                            ? "bg-[#87CEEB] text-white border-[#87CEEB]"
                            : "border-gray-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "food",
                    "wifi",
                    "ac",
                    "mess",
                    "solar",
                    "studyRoom",
                    "tuition",
                  ].map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={filters[amenity as keyof Filters] as boolean}
                        onChange={(e) =>
                          handleFilterChange(
                            amenity as keyof Filters,
                            e.target.checked
                          )
                        }
                      />
                      {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Rent Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.rentRange[1]}
                  onChange={(e) =>
                    handleFilterChange("rentRange", [
                      0,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full"
                />
                <div className="flex justify-between">
                  <span>₹0</span>
                  <span>₹{filters.rentRange[1]}</span>
                </div>
              </div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.verified}
                  onChange={(e) =>
                    handleFilterChange("verified", e.target.checked)
                  }
                />
                Verified Only
              </label>
              <button
                onClick={() =>
                  handleFilterChange("sortByRatings", !filters.sortByRatings)
                }
                className="w-full mb-4 px-4 py-2 text-sm rounded-full border-2 border-gray-300"
              >
                Sort By:{" "}
                <span className="text-[#4A7E8E]">
                  {filters.sortByRatings ? "Ratings" : "Popularity"}
                </span>
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full mb-4 px-4 py-2 text-sm rounded-full border-2  text-red-#EB1808 hover:bg-red-200 hover:text-black transition-colors duration-300"
              >
                Clear Filters
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-[#87CEEB] text-white px-4 py-2 rounded-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterBar;
