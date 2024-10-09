import React, { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";
import HostelDetailsModal from "./HostelDetailsModal";
import UpdateHostelForm from "./UpdateHostelForm";

interface RentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface Owner {
  name: string;
  number: string;
}

type HostelType = "boys" | "girls";

interface HostelImage {
  data: { type: string; data: number[] };
  contentType: string;
  _id: string;
}

interface Hostel {
  _id: string;
  name: string;
  owner: string;
  number: string;
  address: string;
  hostelType: HostelType;
  fetchedImages: { contentType: string; data: string }[]; // Changed from optional to required
  beds: number;
  studentsPerRoom: number;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  images: HostelImage[];
  wifi: boolean;
  ac: boolean;
  kitchenType: string;
  registerDate: string;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  verified: boolean;
  paymentStatus: PaymentStatus;
  pendingVisits: PendingVisit[];
  rentStructure: RentStructure[];
  feedback: Feedback[];
  complaints: Complaint[];
  latitude: number;
  longitude: number;
}

type PaymentStatus = "pending" | "paid";
interface RentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
  _id: string;
}

interface PendingVisit {
  visitDate: string;
  visitTime: string;
  status: string;
}

interface Feedback {
  rating: number;
  comment: string;
  date: string;
}

interface Complaint {
  complaintType: string;
  description: string;
  status: string;
  date: string;
}

interface HostelImage {
  data: { type: string; data: number[] };
  contentType: string;
  _id: string;
}
interface HostelCardProps {
  hostel: Hostel;
  onUpdate: (hostel: Hostel) => void;
  onDelete: (id: string) => void;
}

const HostelCard: React.FC<HostelCardProps> = ({
  hostel,
  onUpdate,
  onDelete,
}) => {
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false);
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);

  const handleUpdateClick = useCallback(() => {
    setUpdateModalOpen(true);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setUpdateModalOpen(false);
  }, []);

  const handleUpdateHostel = useCallback(
    (updatedHostel: Hostel) => {
      onUpdate(updatedHostel);
      setUpdateModalOpen(false);
    },
    [onUpdate]
  );

  return (
    <div className="bg-gradient-to-r from-white to-sky-100 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row w-full border border-sky-200 hover:border-sky-400 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-sky-200/20">
      <div className="md:w-1/3 flex justify-center md:justify-start items-center mb-4 md:mb-0">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full md:w-64 h-48 md:h-auto rounded-lg shadow-lg"
        >
          {hostel.fetchedImages && hostel.fetchedImages.length > 0 ? (
            hostel.fetchedImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`data:${image.contentType};base64,${image.data}`}
                  alt={`${hostel.name} - ${index + 1}`}
                  className="w-full h-full object-cover object-center rounded-lg"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-full flex items-center justify-center bg-sky-200 rounded-lg">
                <p className="text-sky-600">No images available</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      <div className="md:w-2/3 md:pl-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-semibold text-sky-600">
              {hostel.name}
            </h3>
            <div className="space-x-2">
              <button
                onClick={handleUpdateClick}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(hostel._id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <FaTrash />
              </button>
              <button
                onClick={() => setDetailsModalOpen(true)}
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:from-sky-500 hover:to-blue-600 transition-all duration-300"
              >
                <FaInfoCircle />
                <span>View Details</span>
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{hostel.address}</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-sky-500 text-xl" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-sky-700">
                  {hostel.beds}
                </span>{" "}
                Beds
              </p>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <FaBed className="text-sky-500 text-xl" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-sky-700">
                  {hostel.paymentStatus}
                </span>{" "}
                Payment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <FaUtensils className="text-sky-500 text-xl" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-sky-700">
                  {hostel.food ? "Available" : "Not Available"}
                </span>{" "}
                Food
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">
            Contact: <span className="text-sky-700">{hostel.number}</span>
          </p>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 mr-2">Verified:</p>
            <span
              className={`w-3 h-3 rounded-full ${
                hostel.verified ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-sky-700 mb-2">
            Rent Structure
          </h4>
          {hostel.rentStructure.map((rent, index) => (
            <div key={index} className="flex items-center gap-3 mb-2">
              <FaMoneyBillWave className="text-sky-500 text-xl" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-sky-700">
                  {rent.studentsPerRoom}
                </span>{" "}
                Students:
                <span className="font-semibold text-sky-700 ml-2">
                  ₹{rent.rentPerStudent}
                </span>{" "}
                per student
              </p>
            </div>
          ))}
        </div>
      </div>

      {updateModalOpen && (
        <UpdateHostelForm
          hostel={hostel}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateHostel}
        />
      )}
      <HostelDetailsModal
        hostelData={{
          hostel: {
            ...hostel,
            kitchenType: hostel.kitchenType || "Not specified",
            registerDate: hostel.registerDate || new Date().toISOString(),
          },
        }}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />
    </div>
  );
};

export default HostelCard;
