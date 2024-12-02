"use client";

import { API_BASE_URL } from "@/config/api";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`,
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

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

const client = new ApolloClient({
  link: httpLink,
  cache,
  credentials: "include",
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
