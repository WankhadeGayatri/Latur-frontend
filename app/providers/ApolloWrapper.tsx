"use client";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { API_BASE_URL } from "@/config/api";
import { usePathname } from "next/navigation";

const isMaintenancePage = (pathname: string) => {
  return pathname === "/Maintenance";
};

// Create Apollo Client
const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: `${API_BASE_URL}/graphql`,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    fetchOptions: {
      mode: "cors",
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache({
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
    }),
    link: httpLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
};

let client: ApolloClient<any> | null = null;
let isRedirecting = false;

export const getApolloClient = () => {
  if (!client) {
    client = createApolloClient();
  }
  return client;
};

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleBackendError = () => {
    // Prevent multiple redirects
    if (!isRedirecting && !isMaintenancePage(pathname)) {
      isRedirecting = true;
      // Use window.location for hard navigation to avoid client-side routing issues
      window.location.href = "/Maintenance";
    }
  };

  // Check backend connection
  try {
    fetch(`${API_BASE_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "{ __typename }",
      }),
    }).catch(() => {
      handleBackendError();
    });
  } catch (error) {
    handleBackendError();
    return null;
  }

  // Create Apollo Client only if we're not on maintenance page
  if (!isMaintenancePage(pathname)) {
    try {
      client = getApolloClient();
    } catch (error) {
      handleBackendError();
      return null;
    }
  }

  return (
    <ApolloProvider client={client || createApolloClient()}>
      {children}
    </ApolloProvider>
  );
}
