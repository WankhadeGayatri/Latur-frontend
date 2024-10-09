"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  Box,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  CalendarToday,
  Home,
  Description,
  Person,
  ErrorOutline,
} from "@mui/icons-material";
import { API_BASE_URL } from "@/config/api";

interface Complaint {
  student: string;
  description: string;
  isAnonymous: boolean;
  images: string[];
  status: string;
  complaintType: string;
  _id: string;
  date: string;
  hostelId: string;
  hostelName: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 30px rgba(0, 0, 0, 0.15)",
  },
}));

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={1}>
    <Avatar sx={{ bgcolor: "primary.main", width: 24, height: 24, mr: 1 }}>
      {icon}
    </Avatar>
    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="medium">
      {value}
    </Typography>
  </Box>
);

const ComplaintDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openComplaintModal, setOpenComplaintModal] = useState(false);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [complaintCategory, setComplaintCategory] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [complaintImages, setComplaintImages] = useState<File[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const profileId = localStorage.getItem("profileId");
      if (!profileId) {
        setError("Profile ID not found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/students/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudent(response.data);
        setComplaints(response.data.complaints);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching complaints"
        );
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseComplaintModal = () => {
    setOpenComplaintModal(false);
    setComplaintDescription("");
    setComplaintCategory("");
    setIsAnonymous(false);
    setComplaintImages([]);
  };

  const handleSubmitComplaint = async () => {
    const token = localStorage.getItem("token");
    if (!token || !student?.admittedHostel) {
      setSnackbarMessage(
        "You must be logged in and admitted to a hostel to submit a complaint."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("hostelId", student.admittedHostel._id);
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

        // Refresh complaints data
        const updatedResponse = await axios.get(
          `${API_BASE_URL}/api/students/${localStorage.getItem("profileId")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setComplaints(updatedResponse.data.complaints);
      }
    } catch (error) {
      setSnackbarMessage("Error submitting complaint. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        className="bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <LinearProgress className="w-1/2 mb-4" />
        <Typography variant="h6" className="text-blue-600">
          Loading complaints...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        p={4}
        className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen"
      >
        <Alert severity="error" className="rounded-lg">
          <AlertTitle>Error</AlertTitle>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <Typography
        variant="h3"
        className="font-bold text-blue-800 mb-8 text-center"
      >
        My Complaints
      </Typography>
      {student?.admittedHostel && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenComplaintModal(true)}
          >
            Submit Complaint
          </Button>
        </Box>
      )}
      {complaints.length === 0 ? (
        <Alert severity="info" className="rounded-lg">
          <AlertTitle>No Complaints</AlertTitle>
          <Typography>
            There are no complaints to display at this time.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {complaints.map((complaint) => (
            <Grid item xs={12} sm={6} md={4} key={complaint._id}>
              <StyledCard>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {complaint.complaintType}
                    </Typography>
                    <Chip
                      label={complaint.status}
                      color={
                        complaint.status.toLowerCase() === "open"
                          ? "error"
                          : "success"
                      }
                      size="small"
                    />
                  </Box>
                  <InfoItem
                    icon={<Home fontSize="small" />}
                    label="Hostel"
                    value={complaint.hostelName}
                  />
                  <InfoItem
                    icon={<CalendarToday fontSize="small" />}
                    label="Date"
                    value={new Date(complaint.date).toLocaleDateString()}
                  />
                  <Box mt={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Description:
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {complaint.description}
                    </Typography>
                  </Box>
                  {complaint.isAnonymous && (
                    <Chip
                      icon={<ErrorOutline fontSize="small" />}
                      label="Anonymous Complaint"
                      size="small"
                      color="secondary"
                    />
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseComplaintModal}>Cancel</Button>
          <Button onClick={handleSubmitComplaint} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box>
  );
};

export default ComplaintDashboard;
