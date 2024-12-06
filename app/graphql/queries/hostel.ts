// src/graphql/queries/hostel.ts
import { gql } from "@apollo/client";

export const GET_HOSTELS = gql`
  query GetHostels(
    $page: Int!
    $limit: Int!
    $search: String
    $type: String
    $studentsPerRoom: Int
    $minRent: Int
    $maxRent: Int
    $amenities: [String]
  ) {
    hostels(
      page: $page
      limit: $limit
      search: $search
      type: $type
      studentsPerRoom: $studentsPerRoom
      minRent: $minRent
      maxRent: $maxRent
      amenities: $amenities
    ) {
      hostels {
        _id
        name
        number
        address
        hostelType
        beds
        studentsPerRoom
        food
        foodType
        mealOptions
        images {
          data
          contentType
        }
        wifi
        ac
        mess
        solar
        studyRoom
        tuition
        verified
        rentStructure {
          studentsPerRoom
          rentPerStudent
        }
        feedback {
          student
          rating
          comment
          date
        }

        averageRating

        registerDate
        kitchenType
      }
      pagination {
        currentPage
        totalPages
        totalItems
        itemsPerPage
      }
    }
  }
`;
