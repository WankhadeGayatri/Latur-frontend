import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Grid,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Hotel as HotelIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  AttachMoney as AttachMoneyIcon,
  Restaurant as RestaurantIcon,
  Verified as VerifiedIcon,
  Lock as LockIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  LocalDining as MessIcon,
  WbSunny as SolarIcon,
  School as StudyRoomIcon,
  Book as TuitionIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_BASE_URL } from "../../../config/api";
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

interface Complaint {
  student: string;
  description: string;
  isAnonymous: boolean;
  images: { data: string; contentType: string }[];
  date: Date;
  status: "open" | "noticed" | "resolved";
  complaintType?: "Rooms" | "Washroom" | "Wi-Fi" | "Cleanliness" | "Food";
}

interface PendingVisit {
  student: string;
  visitDate: Date;
  visitTime: string;
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

interface HostelCardProps {
  id: string;
  images: Hostel["images"];
  name: string;
  owner: string;
  number: string;
  address: string;
  hostelType: string;
  food: boolean;
  foodType?: string;
  mealOptions?: string[];
  beds: number;
  studentsPerRoom: number;
  rentStructure: Hostel["rentStructure"];
  isVerified: boolean;
  feedback: Hostel["feedback"];
  ratings: number;
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  paymentStatus: string;
  pendingVisits: Hostel["pendingVisits"];
  complaints: Hostel["complaints"];
  onWishlistToggle: (id: string, isInWishlist: boolean) => void;
}

const HostelCard: React.FC<HostelCardProps> = ({
  id,
  name,
  owner,
  number,
  address,
  hostelType,
  beds,
  studentsPerRoom,
  food,
  foodType,
  mealOptions,
  images,
  wifi,
  ac,
  mess,
  solar,
  studyRoom,
  tuition,
  isVerified,
  paymentStatus,
  pendingVisits,
  rentStructure,
  feedback,
  complaints,
  onWishlistToggle,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsInWishlist(wishlist.includes(id));

    const profileId = localStorage.getItem("profileId");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!profileId && !!token);
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to add to wishlist");
      router.push("/login");
      return;
    }
    const profileId = localStorage.getItem("profileId");
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

      if (!isInWishlist) {
        if (wishlist.length >= 5) {
          toast.error("You can't add more than 5 hostels to your wishlist.");
          return;
        }

        const response = await axios.post(
          `${API_BASE_URL}/api/students/wishlist/add`,
          { hostelId: id, profileId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data);
        toast.success(JSON.stringify(response.data));

        wishlist.push(id);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        setIsInWishlist(true);
      } else {
        const response = await axios.post(
          "${API_BASE_URL}/api/students/wishlist/remove",
          { hostelId: id, profileId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("API Response:", response.data);
        toast.success(JSON.stringify(response.data));

        const updatedWishlist = wishlist.filter(
          (hostelId: string) => hostelId !== id
        );
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
      }
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.log("Error Response:", error.response.data);
        toast.error(JSON.stringify(error.response.data));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleViewDetails = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to view full details");
      router.push("/login");
    } else {
      setDetailsOpen(true);
    }
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const calculateAverageRating = () => {
    if (!feedback || feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / feedback.length;
  };

  const averageRating = calculateAverageRating();

  const StarRating: React.FC<{ value: number }> = ({ value }) => (
    <Box display="flex" alignItems="center">
      <Rating value={value} precision={0.5} readOnly size="small" />
      <Typography variant="body2" className="ml-1">
        ({value.toFixed(1)})
      </Typography>
    </Box>
  );

  const BlurredText: React.FC<{ text: string }> = ({ text }) => (
    <span className="filter blur-sm select-none">{text}</span>
  );

  const RentStructureDisplay: React.FC = () => (
    <div className="mt-4">
      <Typography variant="subtitle1" className="text-sky-600 mb-2">
        Rent Structure:
      </Typography>
      {isLoggedIn ? (
        rentStructure.map((rent, index) => (
          <Typography
            key={index}
            variant="body2"
            className="text-sm text-gray-600"
          >
            {rent.studentsPerRoom} Students: ₹{rent.rentPerStudent}/student
          </Typography>
        ))
      ) : (
        <div>
          <BlurredText text="Rent information is hidden" />
          <Typography variant="body2" className="text-sm text-gray-600 mt-2">
            Login to view detailed rent structure
          </Typography>
        </div>
      )}
    </div>
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const Amenity: React.FC<{
    icon: React.ReactElement;
    label: string;
    value: boolean;
  }> = ({ icon, label, value }) => (
    <Tooltip title={isMobile ? label : ""}>
      <Chip
        icon={icon}
        label={isMobile ? undefined : label}
        color={value ? "primary" : "default"}
        variant={value ? "filled" : "outlined"}
        size="small"
        className={`m-1 ${isMobile ? "w-8 h-8 p-0" : ""}`}
      />
    </Tooltip>
  );
  return (
    <>
      <Card className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row w-full border border-gray-200 hover:border-sky-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-sky-200">
        <Box className="w-full md:w-1/3 relative overflow-hidden mb-4 md:mb-0">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="w-full h-54 md:h-70 rounded-lg shadow-md"
          >
            {images && images.length > 0 ? (
              images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`data:${image.contentType};base64,${image.data}`}
                    alt={`${name} - ${index + 1}`}
                    className="w-full h-full object-cover object-center rounded-lg"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <p className="text-gray-400">No images available</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          <Tooltip
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <IconButton
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100 transition-all duration-300 ease-in-out transform hover:scale-110 z-10"
              style={{ color: isInWishlist ? "#ef4444" : "#6b7280" }}
            >
              {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <CardContent className="w-full md:w-2/3 pl-0 md:pl-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Typography
                variant="h3"
                className="text-2xl font-semibold text-sky-600"
              >
                {name}
              </Typography>
              {isVerified && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Verified"
                  size="small"
                  color="primary"
                  className="bg-sky-600"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <Typography
                variant="body2"
                className="text-sm text-gray-600 flex items-center"
              >
                <LocationIcon className="text-sky-500 mr-2" fontSize="small" />
                Address:{" "}
                <span className="font-semibold text-gray-800 ml-1">
                  {address}
                </span>
              </Typography>
              <Typography
                variant="body2"
                className="text-sm text-gray-600 flex items-center"
              >
                <HomeIcon className="text-sky-500 mr-2" fontSize="small" />
                Type:{" "}
                <span className="font-semibold text-gray-800 ml-1">
                  {hostelType}
                </span>
              </Typography>
              {isMobile ? (
                ""
              ) : (
                <Typography
                  variant="body2"
                  className="text-sm text-gray-600 flex items-center"
                >
                  <HotelIcon className="text-sky-500 mr-2" fontSize="small" />
                  Beds:{" "}
                  <span className="font-semibold text-gray-800 ml-1">
                    {beds}
                  </span>
                </Typography>
              )}
              <Typography
                variant="body2"
                className="text-sm text-gray-600 flex items-center"
              >
                <StarRating value={calculateAverageRating()} />
              </Typography>
            </div>
            <div className="mt-4">
              <RentStructureDisplay />
            </div>
            <div className="mt-4">
              <Typography variant="subtitle1" className="text-sky-600 mb-2">
                Amenities:
              </Typography>
              <div className="flex flex-wrap justify-start">
                <Amenity icon={<WifiIcon />} label="Wi-Fi" value={wifi} />
                <Amenity icon={<AcIcon />} label="AC" value={ac} />
                <Amenity icon={<MessIcon />} label="Mess" value={mess} />
                <Amenity icon={<SolarIcon />} label="Solar" value={solar} />
                <Amenity
                  icon={<StudyRoomIcon />}
                  label="Study Room"
                  value={studyRoom}
                />
                <Amenity
                  icon={<TuitionIcon />}
                  label="Tuition"
                  value={tuition}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4 relative">
            <Button
              variant="contained"
              onClick={handleViewDetails}
              className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white shadow-md py-2 px-4 w-full md:w-auto"
              startIcon={!isLoggedIn && <LockIcon />}
            >
              {isLoggedIn ? "View Details" : "Login to View Details"}
            </Button>
          </div>
        </CardContent>

        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          fullWidth
          maxWidth="md"
          PaperProps={{
            style: {
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
              boxShadow: "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
            },
          }}
        >
          <DialogTitle className="text-3xl font-bold text-sky-600 border-b border-gray-200 pb-4 flex justify-between items-center">
            <span>{name}</span>
            {isVerified && (
              <Chip
                icon={<VerifiedIcon />}
                label="Verified"
                color="primary"
                className="bg-sky-600"
              />
            )}
          </DialogTitle>
          <DialogContent>
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              pagination={{ clickable: true }}
              navigation
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full h-80 rounded-lg shadow-md my-4"
            >
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`data:${image.contentType};base64,${image.data}`}
                      alt={`${name} - ${index + 1}`}
                      className="w-full h-full object-cover object-center rounded-lg"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-400">No images available</p>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
            <DialogTitle className="text-2xl font-bold text-sky-600 border-b border-gray-200 pb-2">
              {name}
              {isVerified && (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Verified"
                  size="small"
                  color="primary"
                  className="ml-2 bg-sky-600"
                />
              )}
            </DialogTitle>

            <Grid container spacing={3} className="mt-2">
              <Grid item xs={12} md={6}>
                <List>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Owner"
                      secondary={
                        isLoggedIn ? owner : <BlurredText text={owner} />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Contact"
                      secondary={
                        isLoggedIn ? number : <BlurredText text={number} />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText primary="Address" secondary={address} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Type" secondary={hostelType} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <HotelIcon />
                    </ListItemIcon>
                    <ListItemText primary="Beds" secondary={beds} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className="text-sky-500">
                      <RestaurantIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Food"
                      secondary={
                        food
                          ? `${foodType} (${mealOptions?.join(", ")})`
                          : "Not provided"
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" className="text-sky-600 mb-2">
                  Rent Structure
                </Typography>
                <List>
                  {rentStructure.map((rent, index) => (
                    <ListItem key={index}>
                      <ListItemIcon className="text-sky-500">
                        <AttachMoneyIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${rent.studentsPerRoom} Students`}
                        secondary={`₹${rent.rentPerStudent} per student`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Typography variant="h6" className="text-sky-600 mt-4 mb-2">
                  Amenities
                </Typography>
                <div className="flex flex-wrap">
                  <Amenity icon={<WifiIcon />} label="Wi-Fi" value={wifi} />
                  <Amenity icon={<AcIcon />} label="AC" value={ac} />
                  <Amenity icon={<MessIcon />} label="Mess" value={mess} />
                  <Amenity icon={<SolarIcon />} label="Solar" value={solar} />
                  <Amenity
                    icon={<StudyRoomIcon />}
                    label="Study Room"
                    value={studyRoom}
                  />
                  <Amenity
                    icon={<TuitionIcon />}
                    label="Tuition"
                    value={tuition}
                  />
                </div>
                {isLoggedIn && (
                  <>
                    <Typography variant="h6" className="text-sky-600 mt-4 mb-2">
                      Ratings
                    </Typography>
                    <List>
                      {feedback.slice(0, 3).map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon className="text-sky-500">
                            <StarRating value={item.rating} />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.comment}
                            secondary={new Date(item.date).toLocaleDateString()}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {feedback.length > 3 && (
                      <Typography variant="body2" className="text-sky-600 mt-2">
                        And {feedback.length - 3} more reviews...
                      </Typography>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className="p-4">
            <Button
              onClick={handleWishlistToggle}
              variant="contained"
              color={isInWishlist ? "error" : "primary"}
              startIcon={
                isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />
              }
              className="mr-2"
            >
              {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
            <Button
              onClick={handleCloseDetails}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export default HostelCard;
