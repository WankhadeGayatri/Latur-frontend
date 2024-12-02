// src/hooks/useHostels.ts
"use client";

import { useQuery } from "@apollo/client";
import { GET_HOSTELS } from "../graphql/queries/hostel";

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

interface UseHostelsReturn {
  hostels: Hostel[];
  loading: boolean;
  error: any;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  loadMore: (page: number) => Promise<any>;
}

export const useHostels = (filters: Filters): UseHostelsReturn => {
  // Convert filter values to match GraphQL variables
  const studentsPerRoom =
    filters.studentsPerRoom !== "Any"
      ? parseInt(filters.studentsPerRoom)
      : undefined;

  const type = filters.type !== "All" ? filters.type.toLowerCase() : undefined;

  // Create amenities array only if filters are selected
  const amenities = [
    ...(filters.wifi ? ["wifi"] : []),
    ...(filters.ac ? ["ac"] : []),
    ...(filters.mess ? ["mess"] : []),
    ...(filters.solar ? ["solar"] : []),
    ...(filters.studyRoom ? ["studyRoom"] : []),
    ...(filters.tuition ? ["tuition"] : []),
  ];

  const { data, loading, error, fetchMore } = useQuery(GET_HOSTELS, {
    variables: {
      page: 1,
      limit: 10,
      search: filters.searchName || undefined,
      type,
      studentsPerRoom,
      minRent: filters.rentRange[0] || undefined,
      maxRent: filters.rentRange[1] || undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
    },
    notifyOnNetworkStatusChange: true,
    // Enable cache
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const loadMore = async (page: number) => {
    try {
      const result = await fetchMore({
        variables: { page },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            hostels: {
              ...fetchMoreResult.hostels,
              hostels: [
                ...prev.hostels.hostels,
                ...fetchMoreResult.hostels.hostels,
              ],
            },
          };
        },
      });
      return result.data.hostels;
    } catch (err) {
      console.error("Error loading more hostels:", err);
      return null;
    }
  };

  return {
    hostels: data?.hostels?.hostels || [],
    loading,
    error,
    pagination: data?.hostels?.pagination || null,
    loadMore,
  };
};
