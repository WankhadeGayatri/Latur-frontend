"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Rating,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Home as HomeIcon,
  Verified as VerifiedIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  LocalDining as MessIcon,
  WbSunny as SolarIcon,
  School as StudyRoomIcon,
  Book as TuitionIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

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

interface HostelData {
  _id: string;
  name: string;
  owner: { name: string };
  number: string;
  address: string;
  hostelType: "boys" | "girls" | "cowed";
  beds: number;
  studentsPerRoom: number;
  food: boolean;
  foodType?: "veg" | "nonveg" | "both";
  mealOptions?: ("breakfast" | "lunch" | "dinner" | "all")[];
  images?: { data: string; contentType: string }[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  verified: boolean;
  rentStructure: RentStructure[];
  feedback?: Feedback[];
}

const AdmittedHostelCard: React.FC<{ hostel: HostelData | null }> = ({
  hostel,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openAdmissionDialog, setOpenAdmissionDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);

  if (!hostel) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100px"
      >
        Loading...
      </Box>
    );
  }

  const averageRating =
    hostel.feedback && hostel.feedback.length > 0
      ? hostel.feedback.reduce((sum, f) => sum + f.rating, 0) /
        hostel.feedback.length
      : 0;

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % (hostel.images?.length || 1)
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + (hostel.images?.length || 1)) %
        (hostel.images?.length || 1)
    );
  };

  const AmenityChip: React.FC<{
    label: string;
    available: boolean;
    icon: React.ReactNode;
  }> = ({ label, available, icon }) => (
    <Chip
      label={
        <Box display="flex" alignItems="center">
          {icon}
          <span style={{ marginLeft: 4 }}>{label}</span>
        </Box>
      }
      color={available ? "primary" : "default"}
      variant="outlined"
      size="small"
      sx={{
        mr: 1,
        mb: 1,
      }}
    />
  );

  const uploadAdmissionReceipt = async (
    event?: React.ChangeEvent<HTMLInputElement> | Event
  ) => {
    let file: File | null = null;

    if (event) {
      if (event instanceof Event) {
        const target = event.target as HTMLInputElement;
        file = target.files?.[0] || null;
      } else {
        file = event.target.files?.[0] || null;
      }
    } else {
      // If called without an event (e.g., from button click), open file dialog
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".jpg,.jpeg,.png,.pdf";
      input.onchange = (e) => uploadAdmissionReceipt(e);
      input.click();
      return;
    }

    if (!file) return;

    const formData = new FormData();
    formData.append("admissionReceipt", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/students/upload-receipt`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage(
          "Admission receipt uploaded successfully! Awaiting verification for cashback."
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setOpenAdmissionDialog(false); // Close the dialog after successful upload
      } else {
      }
    } catch (error) {}
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "90%",
        height: "10%",
        padding: 2,
        boxShadow: "0 4px 12px rgba(135, 206, 235, 0.5)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
        },
        backgroundColor: "white",
      }}
    >
      {/* Image section */}
      <Box
        sx={{
          width: "300px",
          height: "250px",
          position: "relative",
          marginRight: 2,
        }}
      >
        {hostel.images && hostel.images.length > 0 ? (
          <>
            <img
              src={`data:${hostel.images[currentImageIndex].contentType};base64,${hostel.images[currentImageIndex].data}`}
              alt={hostel.name}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "8px",
              }}
            />
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: "absolute",
                top: "50%",
                left: 0,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 1)",
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        ) : (
          <Avatar
            variant="square"
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "grey.300",
              borderRadius: 2,
            }}
          >
            No Image
          </Avatar>
        )}
      </Box>

      {/* Details section */}
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {hostel.name}
          </Typography>
          {hostel.verified && (
            <Chip
              icon={<VerifiedIcon />}
              label="Verified"
              color="success"
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, display: "flex", alignItems: "center" }}
        >
          <LocationIcon sx={{ fontSize: 18, mr: 1 }} />
          {hostel.address}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, display: "flex", alignItems: "center" }}
        >
          <HomeIcon sx={{ fontSize: 18, mr: 1 }} />
          Hostel Type:{" "}
          {hostel.hostelType.charAt(0).toUpperCase() +
            hostel.hostelType.slice(1)}
        </Typography>

        {/* Rent Structure */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" color="text.primary" gutterBottom>
            Rent Structure:
          </Typography>
          {hostel.rentStructure.map((rent, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {rent.studentsPerRoom} Students: ₹{rent.rentPerStudent} / student
            </Typography>
          ))}
        </Box>

        {/* Amenities */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.primary" gutterBottom>
            Amenities:
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <AmenityChip
              label="Wi-Fi"
              available={hostel.wifi}
              icon={<WifiIcon />}
            />
            <AmenityChip label="AC" available={hostel.ac} icon={<AcIcon />} />
            <AmenityChip
              label="Mess"
              available={hostel.mess}
              icon={<MessIcon />}
            />
            <AmenityChip
              label="Solar"
              available={hostel.solar}
              icon={<SolarIcon />}
            />
            <AmenityChip
              label="Study Room"
              available={hostel.studyRoom}
              icon={<StudyRoomIcon />}
            />
            <AmenityChip
              label="Tuition"
              available={hostel.tuition}
              icon={<TuitionIcon />}
            />
          </Box>
        </Box>

        {/* Rating */}
        {averageRating > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="text.primary">
              Rating:
            </Typography>
            <Rating
              name="read-only"
              value={averageRating}
              precision={0.5}
              readOnly
              size="small"
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setOpenAdmissionDialog(true)}
          >
            Upload Receipt
          </Button>
        </Box>
      </CardContent>

      {/* Upload Receipt Dialog */}
      <Dialog
        open={openAdmissionDialog}
        onClose={() => setOpenAdmissionDialog(false)}
      >
        <DialogTitle>Upload Admission Receipt</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={uploadAdmissionReceipt}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdmissionDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => uploadAdmissionReceipt()}
            color="primary"
            variant="contained"
          >
            Submit Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AdmittedHostelCard;
