import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Kitchen,
  Wifi,
  AcUnit,
  Restaurant,
  WbSunny,
  MenuBook,
  School,
} from "@mui/icons-material";
import {
  FaBed,
  FaUsers,
  FaMoneyBillWave,
  FaUtensils,
  FaPhone,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type HostelType = "boys" | "girls";
type PaymentStatus = "pending" | "paid";

interface ExistingRentStructure {
  _id: string;
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface NewRentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

type RentStructure = ExistingRentStructure | NewRentStructure;

interface PendingVisit {
  student: string;
  visitDate: Date;
  visitTime: string;
}

interface Feedback {
  rating: number;
  comment: string;
  date: string;
}

interface Complaint {
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
}

interface HostelImage {
  data: { type: string; data: number[] };
  contentType: string;
  _id: string;
}

interface HostelData {
  _id: string;
  name: string;
  number: string;
  address: string;
  hostelType: HostelType;
  beds: number;
  studentsPerRoom: number;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  images: HostelImage[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  kitchenType: string;
  verified: boolean;
  paymentStatus: PaymentStatus;
  rentStructure: RentStructure[];
  registerDate: string;
  pendingVisits?: PendingVisit[];
  feedback?: Feedback[];
  complaints?: Complaint[];
}

interface HostelDetailsModalProps {
  hostelData: {
    hostel: HostelData;
  };
  isOpen: boolean;
  onClose: () => void;
}

interface IconTextProps {
  icon: React.ElementType;
  text: string;
  gradient: string;
}

const HostelDetailsModal: React.FC<HostelDetailsModalProps> = ({
  hostelData,
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const convertToBase64 = (buffer: number[]): string => {
    const binary = buffer.map((b) => String.fromCharCode(b)).join("");
    return btoa(binary);
  };

  const imageUrls = useMemo(() => {
    return (
      hostelData.hostel?.images?.map((img) => {
        const base64 = convertToBase64(img.data.data);
        return `data:${img.contentType};base64,${base64}`;
      }) || []
    );
  }, [hostelData.hostel?.images]);

  const IconText: React.FC<IconTextProps> = ({
    icon: Icon,
    text,
    gradient,
  }) => (
    <Box
      className={`flex items-center space-x-2 p-2 rounded-lg ${gradient} text-white shadow-md`}
    >
      <Icon className="text-2xl" />
      <Typography variant="body1" className="font-semibold">
        {text}
      </Typography>
    </Box>
  );

  if (!hostelData.hostel) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogContent className="bg-gradient-to-br from-white to-sky-100 text-gray-800">
        <IconButton
          onClick={onClose}
          className="absolute top-2 right-2 text-sky-600 hover:text-sky-800"
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" className="mb-6 text-sky-600 font-bold">
          {hostelData.hostel.name}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-96 rounded-lg shadow-xl mb-6"
            >
              {imageUrls.length > 0 ? (
                imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={url}
                      alt={`${hostelData.hostel.name} - ${index + 1}`}
                      className="w-full h-full object-cover object-center rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(url)}
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

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <IconText
                  icon={FaBed}
                  text={`${hostelData.hostel.beds} Beds`}
                  gradient="bg-gradient-to-r from-sky-400 to-blue-500"
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={FaUsers}
                  text={`${hostelData.hostel.studentsPerRoom} per room`}
                  gradient="bg-gradient-to-r from-sky-300 to-indigo-400"
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={
                    hostelData.hostel.verified ? FaCheckCircle : FaTimesCircle
                  }
                  text={
                    hostelData.hostel.verified ? "Verified" : "Not Verified"
                  }
                  gradient={`bg-gradient-to-r ${
                    hostelData.hostel.verified
                      ? "from-green-400 to-emerald-500"
                      : "from-red-400 to-pink-500"
                  }`}
                />
              </Grid>
              <Grid item xs={6}>
                <IconText
                  icon={FaCalendarAlt}
                  text={`Registered: ${new Date(
                    hostelData.hostel.registerDate
                  ).toLocaleDateString()}`}
                  gradient="bg-gradient-to-r from-yellow-400 to-orange-500"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box className="bg-white rounded-lg shadow-lg p-6">
              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                <FaMapMarkerAlt className="inline-block mr-2" /> Address
              </Typography>
              <Typography variant="body1" className="mb-6 pl-6">
                {hostelData.hostel.address}
              </Typography>

              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                <FaPhone className="inline-block mr-2" /> Contact
              </Typography>
              <Typography variant="body1" className="mb-6 pl-6">
                {hostelData.hostel.number}
              </Typography>

              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                <FaMoneyBillWave className="inline-block mr-2" /> Rent Structure
              </Typography>

              {hostelData.hostel.rentStructure.map((rent, index) => (
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

              <Typography
                variant="h6"
                className="mt-6 mb-4 text-sky-700 font-semibold"
              >
                <FaUtensils className="inline-block mr-2" /> Food Details
              </Typography>
              <Box className="pl-6 mb-6">
                <Chip
                  label={hostelData.hostel.food ? "Food Available" : "No Food"}
                  color={hostelData.hostel.food ? "success" : "error"}
                  className="mr-2 mb-2"
                />
                {hostelData.hostel.food && hostelData.hostel.foodType && (
                  <Chip
                    label={hostelData.hostel.foodType}
                    color="primary"
                    className="mr-2 mb-2"
                  />
                )}
                {hostelData.hostel.food &&
                  hostelData.hostel.mealOptions &&
                  hostelData.hostel.mealOptions.map((option, index) => (
                    <Chip
                      key={index}
                      label={option}
                      color="secondary"
                      className="mr-2 mb-2"
                    />
                  ))}
              </Box>

              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                Amenities
              </Typography>
              <Box className="pl-6 mb-6">
                {hostelData.hostel.wifi && (
                  <Chip icon={<Wifi />} label="Wi-Fi" className="mr-2 mb-2" />
                )}
                {hostelData.hostel.ac && (
                  <Chip icon={<AcUnit />} label="AC" className="mr-2 mb-2" />
                )}
                {hostelData.hostel.mess && (
                  <Chip
                    icon={<Restaurant />}
                    label="Mess"
                    className="mr-2 mb-2"
                  />
                )}
                {hostelData.hostel.solar && (
                  <Chip
                    icon={<WbSunny />}
                    label="Solar Power"
                    className="mr-2 mb-2"
                  />
                )}
                {hostelData.hostel.studyRoom && (
                  <Chip
                    icon={<MenuBook />}
                    label="Study Room"
                    className="mr-2 mb-2"
                  />
                )}
                {hostelData.hostel.tuition && (
                  <Chip
                    icon={<School />}
                    label="Tuition"
                    className="mr-2 mb-2"
                  />
                )}
              </Box>

              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                <Kitchen className="inline-block mr-2" /> Kitchen Type
              </Typography>
              <Typography variant="body1" className="mb-6 pl-6">
                {hostelData.hostel.kitchenType}
              </Typography>

              <Typography
                variant="h6"
                className="mb-4 text-sky-700 font-semibold"
              >
                Payment Status
              </Typography>
              <Chip
                label={hostelData.hostel.paymentStatus}
                color={
                  hostelData.hostel.paymentStatus === "paid"
                    ? "success"
                    : "warning"
                }
                className="ml-6"
              />
            </Box>
          </Grid>
        </Grid>

        {hostelData.hostel.feedback &&
          hostelData.hostel.feedback.length > 0 && (
            <>
              <Divider className="my-6" />
              <Typography
                variant="h5"
                className="mb-4 text-sky-700 font-semibold"
              >
                Feedback
              </Typography>
              <Grid container spacing={2}>
                {hostelData.hostel.feedback.map((fb, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box className="p-4 bg-white rounded-lg shadow-lg">
                      <Typography variant="body2" className="mb-2">
                        Rating: {"⭐".repeat(fb.rating)}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        {fb.comment}
                      </Typography>
                      <Typography variant="caption">
                        Date: {new Date(fb.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

        {hostelData.hostel.complaints &&
          hostelData.hostel.complaints.length > 0 && (
            <>
              <Divider className="my-6" />
              <Typography
                variant="h5"
                className="mb-4 text-sky-700 font-semibold"
              >
                Complaints
              </Typography>
              <Grid container spacing={2}>
                {hostelData.hostel.complaints.map((complaint, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box className="p-4 bg-white rounded-lg shadow-lg">
                      <Typography variant="body2" className="mb-2">
                        Type: {complaint.complaintType}
                      </Typography>
                      <Typography variant="body2" className="mb-2">
                        {complaint.description}
                      </Typography>
                      <Typography variant="caption">
                        Status: {complaint.status} | Date:{" "}
                        {new Date(complaint.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
      </DialogContent>

      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent className="bg-black p-0">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
};

export default HostelDetailsModal;
