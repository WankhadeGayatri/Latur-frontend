interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface PaginatedHostelListProps {
  hostels: Hostel[];
  loading: boolean;
  pagination: Pagination | null;
  loadMore: (page: number) => Promise<void>;
}

export interface Hostel {
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

export interface HostelFilters {
  searchName?: string;
  type?: string;
  studentsPerRoom?: number;
  food?: boolean;
  verified?: boolean;
  sortByRatings?: boolean;
  rentRange?: [number, number];
  wifi?: boolean;
  ac?: boolean;
  mess?: boolean;
  solar?: boolean;
  studyRoom?: boolean;
  tuition?: boolean;
}
