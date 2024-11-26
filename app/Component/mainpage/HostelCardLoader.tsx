import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  Restaurant as MessIcon,
  WbSunny as SolarIcon,
  School as StudyRoomIcon,
  Book as TuitionIcon,
  LocationOn as LocationIcon,
  Wc as GenderIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HostelCardLoader: React.FC = () => {
  const iconStyle = { width: "24px", height: "24px" };

  const AmenityPlaceholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-sky-50">
      <Skeleton
        variant="circular"
        width={24}
        height={24}
        className="mb-1"
        sx={{
          backgroundColor: "rgba(14, 165, 233, 0.2)", // sky-500 with opacity
          animationDuration: "1.5s",
        }}
      />
      <Skeleton
        variant="text"
        width={40}
        height={16}
        sx={{
          backgroundColor: "rgba(14, 165, 233, 0.1)", // sky-500 with low opacity
          animationDuration: "1.5s",
        }}
      />
    </div>
  );

  return (
    <Card
      className="bg-white p-3 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row w-full border border-sky-100 hover:border-sky-500 transition-all duration-300 ease-in-out"
      sx={{
        background: "linear-gradient(to right, #f0f9ff, #ffffff)", // Light sky blue gradient
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
      }}
    >
      {/* Image Section */}
      <Box className="w-full md:w-1/3 relative overflow-hidden mb-4 md:mb-0">
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          className="rounded-lg"
          sx={{
            backgroundColor: "rgba(14, 165, 233, 0.1)", // Sky blue with low opacity
            animationDuration: "1.5s",
          }}
        />
      </Box>

      {/* Content Section */}
      <CardContent
        className="w-full md:w-2/3 pl-0 md:pl-6 flex flex-col justify-between"
        style={{ minHeight: "300px" }}
      >
        <div>
          {/* Title and Verified Badge */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{
                backgroundColor: "rgba(14, 165, 233, 0.2)", // Sky blue with opacity
                animationDuration: "1.5s",
              }}
            />
            <Skeleton
              variant="rectangular"
              width={80}
              height={32}
              className="rounded-full"
              sx={{
                backgroundColor: "rgba(14, 165, 233, 0.3)", // Sky blue with more opacity
                animationDuration: "1.5s",
              }}
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mb-2">
            <Typography
              variant="body2"
              className="text-sm text-gray-600 flex items-center flex-wrap"
            >
              <LocationIcon
                className="text-sky-100 mr-2 shrink-0"
                fontSize="small"
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                sx={{
                  backgroundColor: "rgba(14, 165, 233, 0.1)",
                  animationDuration: "1.5s",
                }}
              />
            </Typography>
            <Typography
              variant="body2"
              className="text-sm text-gray-600 flex items-center flex-wrap"
            >
              <GenderIcon
                className="text-sky-100 mr-2 shrink-0"
                fontSize="small"
              />
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{
                  backgroundColor: "rgba(14, 165, 233, 0.1)",
                  animationDuration: "1.5s",
                }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                className="ml-5"
                sx={{
                  backgroundColor: "rgba(14, 165, 233, 0.1)",
                  animationDuration: "1.5s",
                }}
              />
            </Typography>
          </div>

          {/* Rent Structure */}
          <div className="mt-4">
            <Skeleton
              variant="text"
              width="40%"
              height={30}
              sx={{
                backgroundColor: "rgba(14, 165, 233, 0.2)",
                animationDuration: "1.5s",
              }}
            />
            <Skeleton
              variant="text"
              width="60%"
              height={20}
              sx={{
                backgroundColor: "rgba(14, 165, 233, 0.1)",
                animationDuration: "1.5s",
              }}
            />
          </div>

          {/* Amenities */}
          <div className="mt-1">
            <Skeleton
              variant="text"
              width="30%"
              height={30}
              sx={{
                backgroundColor: "rgba(14, 165, 233, 0.2)",
                animationDuration: "1.5s",
              }}
            />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <AmenityPlaceholder key={item} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HostelCardLoader;
