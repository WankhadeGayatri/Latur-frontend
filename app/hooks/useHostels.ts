"use client";

import { useQuery, useLazyQuery, ApolloQueryResult } from "@apollo/client";
import { GET_HOSTELS } from "../graphql/queries/hostel";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface Image {
  contentType: string;
  data: string;
}

interface PendingVisit {
  student: string;
  visitDate: Date;
  visitTime: string;
}

interface RentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface Feedback {
  student: string;
  rating: number;
  comment: string;
  date: Date;
}

interface ComplaintImage {
  data: string;
  contentType: string;
}

interface Complaint {
  student: string;
  description: string;
  isAnonymous: boolean;
  images: ComplaintImage[];
  date: Date;
  status: string;
  complaintType: string;
}
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
  images: Image[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  verified: boolean;
  paymentStatus: string;
  pendingVisits: PendingVisit[];
  rentStructure: RentStructure[];
  feedback: Feedback[];
  complaints: Complaint[];
  latitude: number;
  longitude: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface HostelsResponse {
  hostels: {
    hostels: Hostel[];
    pagination: Pagination;
  };
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
  error: Error | null;
  pagination: Pagination | null;
  currentPage: number;
  goToPage: (page: number) => Promise<void>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  prefetchedPages: Set<number>;
  isPageLoading: boolean;
  isBackendAvailable: boolean;
}
interface QueryVariables {
  search?: string;
  type?: string;
  studentsPerRoom?: number;
  minRent?: number;
  maxRent?: number;
  amenities?: string[];
  page: number;
  limit: number;
}

export const useHostels = (
  filters: Filters,
  itemsPerPage: number = 10
): UseHostelsReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<boolean>(false);
  const prefetchedPages = useRef<Set<number>>(new Set([1]));
  const hostelCache = useRef<Map<number, Hostel[]>>(new Map());
  const router = useRouter();
  // Convert filters to query variables
  const getQueryVariables = useCallback(
    (filters: Filters): QueryVariables => {
      const variables: QueryVariables = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Only add other filters if backend is available
      if (!backendError) {
        if (filters.searchName) {
          variables.search = filters.searchName;
        }

        if (filters.type !== "All") {
          variables.type = filters.type.toLowerCase();
        }

        if (filters.studentsPerRoom !== "Any") {
          variables.studentsPerRoom = parseInt(filters.studentsPerRoom);
        }

        if (filters.rentRange[0] > 0) {
          variables.minRent = filters.rentRange[0];
        }

        if (filters.rentRange[1] < 10000) {
          variables.maxRent = filters.rentRange[1];
        }

        const selectedAmenities = Object.entries({
          wifi: filters.wifi,
          ac: filters.ac,
          mess: filters.mess,
          solar: filters.solar,
          studyRoom: filters.studyRoom,
          tuition: filters.tuition,
        })
          .filter(([_, value]) => value)
          .map(([key]) => key);

        if (selectedAmenities.length > 0) {
          variables.amenities = selectedAmenities;
        }
      }

      return variables;
    },
    [currentPage, itemsPerPage, backendError]
  );

  const { data, loading, error, client } = useQuery<HostelsResponse>(
    GET_HOSTELS,
    {
      variables: getQueryVariables(filters),
      notifyOnNetworkStatusChange: true,
      onError: (queryError) => {
        console.error("Query Error:", queryError);
        setBackendError(true);
      },
      skip: backendError, // Skip the query if backend is not available
    }
  );
  if (backendError) {
    return {
      hostels: [],
      loading: false,
      error: new Error("Backend is not responding"),
      pagination: null,
      currentPage: 1,
      goToPage: async () => {},
      hasNextPage: false,
      hasPreviousPage: false,
      prefetchedPages: new Set(),
      isPageLoading: false,
      isBackendAvailable: false,
    };
  }

  const isValidResponse = useCallback(
    (responseData: HostelsResponse | undefined): boolean => {
      // Check if response exists and has expected structure
      return Boolean(
        responseData &&
          responseData.hostels &&
          Array.isArray(responseData.hostels.hostels) &&
          responseData.hostels.pagination
      );
    },
    []
  );

  if (backendError || error) {
    return {
      hostels: [],
      loading: false,
      error: error || new Error("Backend is not responding"),
      pagination: null,
      currentPage: 1,
      goToPage: async () => {},
      hasNextPage: false,
      hasPreviousPage: false,
      prefetchedPages: new Set(),
      isPageLoading: false,
      isBackendAvailable: false,
    };
  }
  // Type guard to check if pagination data exists and is valid
  const isPaginationValid = (
    data: HostelsResponse | undefined
  ): data is HostelsResponse => {
    return Boolean(
      data?.hostels?.pagination &&
        typeof data.hostels.pagination.totalPages === "number" &&
        data.hostels.pagination.totalPages > 0
    );
  };

  // Helper function to get total pages safely
  const getTotalPages = (): number => {
    if (isPaginationValid(data)) {
      return data.hostels.pagination.totalPages;
    }
    return 0;
  };

  const prefetchNextPage = useCallback(async () => {
    const nextPage = currentPage + 1;
    const totalPages = getTotalPages();

    if (
      totalPages === 0 ||
      nextPage > totalPages ||
      prefetchedPages.current.has(nextPage)
    ) {
      return;
    }

    try {
      const result = await client.query<HostelsResponse>({
        query: GET_HOSTELS,
        variables: {
          ...getQueryVariables(filters),
          page: nextPage,
        },
      });

      if (result?.data?.hostels?.hostels) {
        prefetchedPages.current.add(nextPage);
        hostelCache.current.set(nextPage, result.data.hostels.hostels);
      }
    } catch (error) {
      console.error("Error prefetching next page:", error);
    }
  }, [currentPage, data, filters, client, itemsPerPage]);

  const goToPage = async (page: number): Promise<void> => {
    const totalPages = getTotalPages();

    if (page < 1 || (totalPages > 0 && page > totalPages)) {
      return;
    }

    setIsPageLoading(true);

    try {
      if (hostelCache.current.has(page)) {
        setCurrentPage(page);
      } else {
        const result = await client.query<HostelsResponse>({
          query: GET_HOSTELS,
          variables: {
            ...getQueryVariables(filters),
            page,
          },
        });

        if (result?.data?.hostels?.hostels) {
          hostelCache.current.set(page, result.data.hostels.hostels);
          prefetchedPages.current.add(page);
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.error("Error navigating to page:", error);
    } finally {
      setIsPageLoading(false);
    }
  };
  // Effect for prefetching next page with proper error handling
  useEffect(() => {
    if (!loading && !error && isPaginationValid(data)) {
      prefetchNextPage();
    }
  }, [loading, error, prefetchNextPage, data]);

  // Clear cache when filters change
  useEffect(() => {
    hostelCache.current.clear();
    prefetchedPages.current = new Set([1]);
    setCurrentPage(1);
  }, [filters]);

  return {
    hostels: data?.hostels?.hostels || [],
    loading,
    error: null,
    pagination: data?.hostels?.pagination || null,
    currentPage,
    goToPage,
    hasNextPage: currentPage < getTotalPages(),
    hasPreviousPage: currentPage > 1,
    prefetchedPages: prefetchedPages.current,
    isPageLoading,
    isBackendAvailable: true,
  };
};

export const usePaginationRange = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
) => {
  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
};
