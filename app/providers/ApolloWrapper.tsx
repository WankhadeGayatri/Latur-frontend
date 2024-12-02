"use client";

import { API_BASE_URL } from "@/config/api";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Hostel } from "../types/Hostel";
interface HostelResponse {
  hostels: Hostel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface HostelQueryArgs {
  type?: string;
  studentsPerRoom?: number;
  minRent?: number;
  maxRent?: number;
  amenities?: string[];
  search?: string;
  page?: number;
}
// Optimized cache configuration
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        hostels: {
          keyArgs: [
            "type",
            "studentsPerRoom",
            "minRent",
            "maxRent",
            "amenities",
            "search",
          ],
          merge(existing = { hostels: [], pagination: {} }, incoming) {
            return {
              hostels: [...existing.hostels, ...incoming.hostels],
              pagination: incoming.pagination,
            };
          },
        },
      },
    },
  },
});

// Create HTTP link with CORS configuration
const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
  credentials: "include",
  fetchOptions: {
    mode: "cors",
  },
});

// Add auth context if needed
const authLink = setContext((_, { headers }) => {
  // Get authentication token or other headers
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Apollo-Require-Preflight": "true",
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "ignore",
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  connectToDevTools: process.env.NODE_ENV === "development",
  assumeImmutableResults: true,
  name: "hostel-client",
  version: "1.0",
});
