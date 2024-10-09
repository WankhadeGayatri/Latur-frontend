"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  Stack,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { API_BASE_URL } from "@/config/api";

interface Complaint {
  _id: string;
  status: "open" | "resolved" | "noticed";
  complaintType: string;
  description: string;
  date: string;
  isAnonymous: boolean;
  studentName: string;
  hostelName: string;
  images?: Array<{ contentType: string; data: string }>;
}

interface Stats {
  total: number;
  resolved: number;
  open: number;
  noticed: number;
}
interface StatusColors {
  [key: string]:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "success"
    | "warning";
}

const statusColors: StatusColors = {
  new: "default",
  inProgress: "primary",
  resolved: "success",
  closed: "secondary",
  rejected: "error", // Correct color for error status
  // Add more mappings as needed
};

const StyledCard = styled(Card)(({ theme }) => ({
  background: "white",
  color: theme.palette.text.primary,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s ease-in-out",
  border: "2px solid transparent",
  borderRadius: "15px",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
    border: "2px solid #f0f0f0",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    background: "white",
    color: theme.palette.text.primary,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    border: "2px solid #00c6ff",
    borderRadius: "20px",
  },
}));

const GradientBorderCard = styled(StyledCard)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.1)",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
  },
  "&:hover::before": {
    opacity: 1,
  },
  "&:hover .MuiCardContent-root": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  "& .MuiCardContent-root": {
    position: "relative",
    zIndex: 1,
    transition: "background-color 0.3s ease-in-out",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #00c6ff, #0072ff)",
  color: theme.palette.common.white,
  fontWeight: "bold",
  borderRadius: "25px",
  padding: "10px 20px",
  "&:hover": {
    background: "linear-gradient(45deg, #0072ff, #00c6ff)",
  },
}));

const statusIcons = {
  open: <ErrorIcon color="action" />,
  noticed: <HourglassEmptyIcon color="action" />,
  resolved: <CheckCircleIcon color="action" />,
};

const Complaints = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    resolved: 0,
    open: 0,
    noticed: 0,
  });

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [complaintsData, setComplaintsData] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const fetchComplaintsForAllHostels = async () => {
    try {
      const profileId = localStorage.getItem("profileId");
      if (profileId) {
        const hostelsResponse = await axios.get(
          `${API_BASE_URL}/api/hostels/${profileId}/hostels`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const hostels = hostelsResponse.data.hostels;
        console.log("comaplaintres", hostelsResponse.data);
        let allComplaints: Complaint[] = [];
        let totalComplaints = 0;
        let resolvedComplaints = 0;
        let noticedComplaints = 0;
        let openComplaints = 0;

        for (const hostel of hostels) {
          const complaintsResponse = await axios.get(
            `${API_BASE_URL}/api/hostels/${hostel._id}/complaints`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const hostelComplaints = complaintsResponse.data.complaints.map(
            (complaint: Complaint) => ({
              ...complaint,
              hostelName: hostel.name,
            })
          );

          allComplaints = [...allComplaints, ...hostelComplaints];
          setComplaintsData(allComplaints);

          totalComplaints += hostelComplaints.length;
          resolvedComplaints += hostelComplaints.filter(
            (c: any) => c.status === "resolved"
          ).length;
          noticedComplaints += hostelComplaints.filter(
            (c: any) => c.status === "noticed"
          ).length;
          openComplaints += hostelComplaints.filter(
            (c: any) => c.status === "open"
          ).length;
        }

        setStats({
          total: totalComplaints,
          resolved: resolvedComplaints,
          noticed: noticedComplaints,
          open: openComplaints,
        });
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  useEffect(() => {
    fetchComplaintsForAllHostels();
  }, []);

  const handleStatusChange = async (complaintId: string, newStatus: string) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/hostels/complaints/${complaintId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchComplaintsForAllHostels();
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
  };

  const handleOpenDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedComplaint(null);
    setOpen(false);
  };

  const filteredComplaints = complaintsData.filter(
    (complaint) =>
      categoryFilter === "All" || complaint.complaintType === categoryFilter
  );

  return (
    <Box className="flex bg-white text-black min-h-screen">
      <Box className="flex-grow p-6">
        <Typography
          variant="h4"
          className="mb-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Complaints Dashboard
        </Typography>

        {/* Complaints Stats */}
        <Grid container spacing={3} className="mb-8">
          {Object.entries(stats).map(([key, value]) => (
            <Grid item xs={3} sm={3} key={key}>
              <GradientBorderCard className="text-center">
                <CardContent>
                  <Typography
                    variant="h6"
                    className="capitalize mb-2 font-bold text-blue-300"
                  >
                    {key}
                  </Typography>
                  <Typography variant="h4" className="font-bold text-black">
                    {value}
                  </Typography>
                </CardContent>
              </GradientBorderCard>
            </Grid>
          ))}
        </Grid>

        {/* Complaints List */}
        <Typography
          variant="h5"
          className="mb-4 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
        >
          Recent Complaints
        </Typography>

        {/* Category Filter */}
        <FormControl variant="outlined" className="mb-4">
          <InputLabel>Filter by Category</InputLabel>
          {/* <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label="Filter by Category"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Facilities">Facilities</MenuItem>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Staff">Staff</MenuItem>
            <MenuItem value="Hygiene">Hygiene</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select> */}
        </FormControl>

        <Grid container spacing={3}>
          {filteredComplaints.map((complaint) => (
            <Grid item xs={12} md={6} lg={4} key={complaint._id}>
              <StyledCard onClick={() => handleOpenDialog(complaint)}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {statusIcons[complaint.status]}
                    </Avatar>
                  }
                  title={complaint.complaintType}
                  subheader={new Date(complaint.date).toLocaleString()}
                />
                <CardContent>
                  <Typography variant="body1" className="mb-2">
                    {complaint.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="font-bold"
                  >
                    {complaint.isAnonymous
                      ? "Anonymous"
                      : complaint.studentName}{" "}
                    - {complaint.hostelName}
                  </Typography>
                  <Stack direction="row" spacing={1} className="mt-2">
                    <Chip
                      label={complaint.status.toUpperCase()}
                      color={statusColors[complaint.status]}
                      icon={statusIcons[complaint.status]}
                    />
                  </Stack>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Complaint Details Dialog */}
        {selectedComplaint && (
          <StyledDialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogContent>
              <Typography variant="h6" className="font-semibold mb-2">
                Type: {selectedComplaint.complaintType}
              </Typography>
              <Typography variant="body1" className="mb-4">
                {selectedComplaint.description}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                className="font-bold"
              >
                {selectedComplaint.isAnonymous
                  ? "Anonymous"
                  : selectedComplaint.studentName}{" "}
                - {selectedComplaint.hostelName}
              </Typography>

              {/* Complaint Images */}
              {selectedComplaint.images && (
                <Box className="mt-4">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                  >
                    {selectedComplaint.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`data:${image.contentType};base64,${image.data}`}
                          alt={`Complaint Image ${index + 1}`}
                          className="rounded-lg shadow-lg"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <StyledButton
                onClick={() =>
                  handleStatusChange(selectedComplaint._id, "open")
                }
                style={{
                  background: "linear-gradient(45deg, #ff6b6b, #e74c3c)",
                }}
              >
                Open ({stats.open})
              </StyledButton>
              <StyledButton
                onClick={() =>
                  handleStatusChange(selectedComplaint._id, "noticed")
                }
                style={{
                  background: "linear-gradient(45deg, #feca57, #f39c12)",
                }}
              >
                Noticed ({stats.noticed})
              </StyledButton>
              <StyledButton
                onClick={() =>
                  handleStatusChange(selectedComplaint._id, "resolved")
                }
                style={{
                  background: "linear-gradient(45deg, #1dd1a1, #10ac84)",
                }}
              >
                Resolved ({stats.resolved})
              </StyledButton>
              <StyledButton onClick={handleCloseDialog}>Close</StyledButton>
            </DialogActions>
          </StyledDialog>
        )}
      </Box>
    </Box>
  );
};

export default Complaints;
