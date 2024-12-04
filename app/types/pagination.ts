export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  __typename: "Pagination";
}

export interface HostelResponse {
  hostels: {
    pagination: PaginationInfo;
    __typename: "HostelResponse";
  };
}
