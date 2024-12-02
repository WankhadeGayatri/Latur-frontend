// src/lib/apollo-client.ts
import { API_BASE_URL } from "@/config/api";
import { ApolloClient, InMemoryCache } from "@apollo/client";

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

export const client = new ApolloClient({
  uri: `${API_BASE_URL}/graphql`,
  cache,
});
