import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string, location: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("put your location");

  const handleSearch = () => {
    onSearch(query, location);
  };

  return (
    <div className="flex justify-center items-center ">
      <div
        className="w-full max-w-4xl p-6 bg-white rounded-lg !mt-0"
        style={{ marginTop: "0 !important" }}
      >
        <div className="flex items-center w-full border-2 border-sky-200 rounded-xl overflow-hidden transition-all duration-300 focus-within:ring-2 focus-within:ring-sky-300 focus-within:border-sky-400">
          <div className="flex-grow px-8 py-4">
            <input
              type="text"
              placeholder="Search Hostel..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
            />
          </div>
          <div className="flex items-center pr-2">
            <div className="mr-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center transition-all duration-300 hover:bg-sky-200">
                <MapPin size={20} className="text-sky-500" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
