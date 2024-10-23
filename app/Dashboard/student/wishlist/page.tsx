"use client";
import React, { useState, useEffect, MouseEvent } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  FormControlLabel,
  Checkbox,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Grid,
} from "@mui/material";
import axios from "axios";
import { FaBed, FaUtensils, FaCheckCircle } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import { AlertColor } from "@mui/material/Alert";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Fab, Tooltip } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { useWishlist } from "../component/WishlistContext";
import { API_BASE_URL } from "@/config/api";

interface Hostel {
  _id: string;
  name: string;
  address: string;
  images: Array<{ contentType: string; data: string }>;
  hostelType: string;
  beds: number;
  food: boolean;
  verified: boolean;
  hostelVisits: Array<{ _id: string; status: string }>;
}

interface Student {
  _id: string;
  name: string;
  wishlistSubmitted: boolean;
  wishlistApproved: boolean;
  admittedHostel: { _id: string } | null; // Update this line
  admissionReceipt: string | null;
  cashbackApplied: boolean;
  visitScheduled: boolean;
  hostelVisits: Array<{ hostel: string; status: string }>;
}

const BackToHomeButton = () => {
  const router = useRouter();
  return (
    <Tooltip title="Back to Home" placement="left">
      <Fab
        color="primary"
        aria-label="back to home"
        onClick={() => router.push("/")}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#0077be",
          "&:hover": {
            backgroundColor: "#005c99",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        <HomeIcon />
      </Fab>
    </Tooltip>
  );
};
export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Hostel[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [openVisitDialog, setOpenVisitDialog] = useState(false);
  const [openAdmissionDialog, setOpenAdmissionDialog] = useState(false);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);
  const [openComplaintModal, setOpenComplaintModal] = useState(false);
  const [visitDate, setVisitDate] = useState<string>("");
  const [visitTime, setVisitTime] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [feedbackRating, setFeedbackRating] = useState<number | null>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [complaintImages, setComplaintImages] = useState<File[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");
  const { updateWishlistCount } = useWishlist();
  useEffect(() => {
    fetchWishlist();
    fetchStudentDetails();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    const profileId = localStorage.getItem("profileId");
    const token = localStorage.getItem("token");
    if (!profileId) {
      console.error("No student ID found in local storage");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/students/wishlist/${profileId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const wishlistWithPhotos = await Promise.all(
        response.data.map(async (hostel: Hostel) => {
          const photoResponse = await axios.get(
            `${API_BASE_URL}/api/hostels/gethostalphotos/${hostel._id}`
          );
          return {
            ...hostel,
            images: photoResponse.data,
            hostelVisits: hostel.hostelVisits || [],
          };
        })
      );

      setWishlist(wishlistWithPhotos);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async () => {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/students/${profileId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    console.error("An error occurred:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  };

  const removeFromWishlist = async (hostelId: string) => {
    if (student?.wishlistSubmitted) {
      setSnackbarMessage(
        "Wishlist is already submitted and cannot be modified."
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/students/wishlist/remove`,
        { hostelId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchWishlist();
      updateWishlistCount();
      setSnackbarMessage("Hostel removed from wishlist");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      handleError(error);
    }
  };

  const submitWishlist = async () => {
    if (wishlist.length === 0) {
      setSnackbarMessage(
        "Please add at least one hostel to your wishlist before submitting."
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(
        "${API_BASE_URL}/api/students/wishlist/submit",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSnackbarMessage("Wishlist submitted for review!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchStudentDetails();
    } catch (error) {
      console.error("Error submitting wishlist:", error);
      handleError(error);
    }
  };

  const takeAdmission = async (hostelId: string) => {
    if (!student?.wishlistApproved) {
      setSnackbarMessage(
        "Your wishlist must be approved before taking admission."
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }
    try {
      await axios.post(
        "${API_BASE_URL}/api/students/take-admission",
        { hostelId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      setSnackbarMessage("Admission taken successfully!");
      setSnackbarSeverity("success");
      fetchStudentDetails();
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error taking admission:", error);
      handleError(error);
    }
  };

  const markAsNotInterested = async (hostelId: string) => {
    try {
      const response = await axios.post(
        "${API_BASE_URL}/api/students/not-interested",
        { hostelId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      fetchWishlist();
      fetchStudentDetails();
    } catch (error) {
      handleError(error);
    }
  };

  const handleScheduleOrUpdateVisit = async () => {
    if (!selectedHostel || !visitDate || !visitTime || !studentEmail) {
      setSnackbarMessage("Please fill in all fields.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/students/request-visit`,
        {
          hostelId: selectedHostel._id,
          visitDate,
          visitTime,
          studentEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenVisitDialog(false);
      fetchStudentDetails();
      fetchWishlist();
    } catch (error) {
      handleError(error);
    }
  };

  const isVisitScheduled = (hostelId: string) => {
    return student?.hostelVisits.some((visit) => visit.hostel === hostelId);
  };

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
        "${API_BASE_URL}/api/students/upload-receipt",
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
        fetchStudentDetails();
        setOpenAdmissionDialog(false); // Close the dialog after successful upload
      } else {
        handleError(response);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const submitFeedback = async () => {
    if (!selectedHostel) return;
    try {
      await axios.post(
        "${API_BASE_URL}/api/students/submit-feedback",
        {
          hostelId: selectedHostel._id,
          rating: feedbackRating,
          comment: feedbackComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")} `,
          },
        }
      );
      setSnackbarMessage("Feedback submitted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenFeedbackDialog(false);
      setFeedbackRating(0);
      setFeedbackComment("");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmitComplaint = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedHostel) {
      setSnackbarMessage("You must be logged in to submit a complaint.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("hostelId", selectedHostel._id);
    formData.append("description", complaintDescription);
    formData.append("complaintType", complaintCategory);
    formData.append("isAnonymous", isAnonymous.toString());

    complaintImages.forEach((image, index) => {
      formData.append("images", image);
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/students/complaints`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSnackbarMessage("Complaint submitted successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        handleCloseComplaintModal();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCloseComplaintModal = () => {
    setOpenComplaintModal(false);
    setComplaintDescription("");
    setComplaintCategory("");
    setIsAnonymous(false);
    setComplaintImages([]);
  };

  function scheduleVisit(_id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleSubmitReceipt(
    event: MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#1a237e", mb: 4, fontWeight: "bold" }}
      >
        My Wishlist
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
            {/* <div className="w-90 h-90 justify-center">
              <Lottie animationData={wait} loop={true} autoplay={true} />
            </div> */}
          </div>
          <Typography
            variant="h6"
            sx={{ ml: 2, marginTop: "35%", color: "#1a237e" }}
          >
            Fetching wishlist... 🕒
          </Typography>
        </Box>
      ) : wishlist.length === 0 ? (
        <Typography variant="body1" align="center">
          Your wishlist is empty. Add some hostels to get started! 📝
        </Typography>
      ) : (
        <Box
          sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", pb: 2 }}
        >
          {wishlist.map((hostel) => (
            <Card
              key={hostel._id}
              sx={{
                width: 400,
                minWidth: 400,
                bgcolor: "#ffffff",
                color: "#333",
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                mr: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              {hostel.images && hostel.images.length > 0 ? (
                <Swiper
                  navigation
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination]}
                  style={{ width: "100%" }}
                >
                  {hostel.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                        image={`data:${image.contentType};base64,${image.data}`}
                        alt={`Image ${index + 1}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#e0e0e0",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No images available
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#1a237e", mb: 1, fontWeight: "bold" }}
                >
                  {hostel.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {hostel.address}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  <Chip
                    icon={<FaBed />}
                    label={`${hostel.beds} Beds`}
                    size="small"
                    sx={{ bgcolor: "#e8eaf6", color: "#3f51b5" }}
                  />
                  <Chip
                    icon={<FaUtensils />}
                    label={hostel.food ? "Food Available" : "No Food"}
                    size="small"
                    sx={{
                      bgcolor: hostel.food ? "#e8f5e9" : "#ffebee",
                      color: hostel.food ? "#2e7d32" : "#c62828",
                    }}
                  />
                  {hostel.verified && (
                    <Chip
                      icon={<FaCheckCircle />}
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}
                    />
                  )}
                </Box>
                <Box
                  display="flex"
                  flexWrap="wrap"
                  justifyContent="center"
                  gap={1}
                >
                  {!student?.wishlistSubmitted && (
                    <>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeFromWishlist(hostel._id)}
                        size="small"
                      >
                        Remove
                      </Button>
                      {/* <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#0077be",
                          "&:hover": { bgcolor: "#005c99" },
                        }}
                        onClick={submitWishlist}
                        disabled={wishlist.length === 0}
                        size="small"
                      >
                        Submit Wishlist
                      </Button> */}
                    </>
                  )}

                  {student?.wishlistSubmitted && !student.wishlistApproved && (
                    <Typography variant="body2" color="text.secondary">
                      Wishlist under review
                    </Typography>
                  )}

                  {student?.wishlistSubmitted &&
                    student.wishlistApproved &&
                    !student.admittedHostel && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Now you can Schdeduled visit from my Visit field
                        </Typography>
                        {/* <Button
                          variant="outlined"
                          sx={{ color: "#0077be", borderColor: "#0077be" }}
                          onClick={() => {
                            setSelectedHostel(hostel);
                            setOpenVisitDialog(true);
                          }}
                          size="small"
                        >
                          {isVisitScheduled(hostel._id)
                            ? "Update Visit"
                            : "Schedule Visit"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#0077be",
                            "&:hover": { bgcolor: "#005c99" },
                          }}
                          onClick={() => takeAdmission(hostel._id)}
                          size="small"
                        >
                          Take Admission
                        </Button>
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() => markAsNotInterested(hostel._id)}
                          size="small"
                        >
                          Not Interested
                        </Button> */}
                      </>
                    )}
                  {/* {student?.admittedHostel &&
                    student.admittedHostel._id === hostel._id && (
                      <>
                        <Button
                          variant="outlined"
                          sx={{ color: "#0077be", borderColor: "#0077be" }}
                          onClick={() => {
                            setSelectedHostel(hostel);
                            setOpenFeedbackDialog(true);
                          }}
                          size="small"
                        >
                          Submit Feedback
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{ color: "#0077be", borderColor: "#0077be" }}
                          onClick={() => {
                            setSelectedHostel(hostel);
                            setOpenComplaintModal(true);
                          }}
                          size="small"
                        >
                          Complaint
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#0077be",
                            "&:hover": { bgcolor: "#005c99" },
                          }}
                          onClick={() => setOpenAdmissionDialog(true)}
                          size="small"
                        >
                          {student.admissionReceipt
                            ? "Receipt Uploaded"
                            : "Upload Receipt"}
                        </Button>
                      </>
                    )} */}
                  {student?.admittedHostel &&
                    student.admittedHostel._id === hostel._id && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          You can see your own complaint and feedback
                        </Typography>
                      </>
                    )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      {/* {!student?.wishlistSubmitted && (
        <>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#0077be",
              "&:hover": { bgcolor: "#005c99" },
              justifyContent: "center",
            }}
            onClick={submitWishlist}
            disabled={wishlist.length === 0}
            size="large"
          >
            Submit Wishlist
          </Button>
        </>
      )} */}

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
          <>
            <Button
              onClick={() => setOpenAdmissionDialog(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => uploadAdmissionReceipt()}
              color="primary"
              variant="contained"
            >
              Submit Receipt
            </Button>
          </>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
      >
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Rating
            name="rating"
            value={feedbackRating}
            onChange={(event, newValue) => {
              setFeedbackRating(newValue);
            }}
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={submitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openComplaintModal} onClose={handleCloseComplaintModal}>
        <DialogTitle>Submit a Complaint</DialogTitle>
        <DialogContent>
          <TextField
            label="Complaint Description"
            multiline
            rows={4}
            fullWidth
            value={complaintDescription}
            onChange={(e) => setComplaintDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Complaint Category</InputLabel>
            <Select
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value as string)}
              label="Complaint Category"
            >
              <MenuItem value="Wi-Fi">Wi-Fi</MenuItem>
              <MenuItem value="Washroom">Washroom</MenuItem>
              <MenuItem value="Cleanliness">Cleanliness</MenuItem>
              <MenuItem value="Rooms">Rooms</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
            }
            label="Submit Anonymously"
            sx={{ mb: 2 }}
          />
          <Box>
            {complaintImages.length > 0 && (
              <Grid container spacing={1}>
                {complaintImages.map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`complaint-image-${index}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComplaintModal}>Cancel</Button>
          <Button onClick={handleSubmitComplaint} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openVisitDialog} onClose={() => setOpenVisitDialog(false)}>
        <DialogTitle>
          {isVisitScheduled(selectedHostel?._id || "")
            ? "Update Visit"
            : "Schedule Visit"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVisitDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleScheduleOrUpdateVisit} color="primary">
            {isVisitScheduled(selectedHostel?._id || "")
              ? "Update Visit"
              : "Schedule Visit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <BackToHomeButton />
    </Box>
  );
}
