// WishlistContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

interface WishlistContextType {
  wishlistCount: number;
  updateWishlistCount: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistCount: 0,
  updateWishlistCount: async () => {},
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("profileId");
    if (token && id) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/students/wishlist/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("wishlist", response);
        setWishlistCount(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  };

  useEffect(() => {
    fetchWishlistCount();
  }, []);

  const updateWishlistCount = async () => {
    await fetchWishlistCount();
  };

  return (
    <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
};
