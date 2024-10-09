"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

// Define types
interface Student {
  _id: string;
  name: string;
  number: string;
}

interface Visit {
  _id: string;
  student: Student | null;
  visitDate: string;
  visitTime: string;
  status: "pending" | "accepted" | "not_interested";
  isNew?: boolean;
}

interface VisitingStudentsProps {
  hostelId: string;
}

const GradientCard = styled(Box)(({ theme }) => ({
  background: "linear-gradient(145deg, #e6f7ff 0%, #ffffff 100%)",
  borderRadius: 16,
  transition: "0.3s",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
  },
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const CardTitle = styled(Typography)({
  fontWeight: "bold",
  color: "#0288d1",
  marginBottom: 16,
  fontSize: "1.5rem",
});

const CardSubtitle = styled(Typography)({
  color: "#424242",
  marginBottom: 12,
  fontSize: "1.1rem",
});

const ButtonGroup = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  marginTop: "auto",
  paddingTop: 16,
});

const StyledButton = styled(Button)({
  borderRadius: 20,
  padding: "8px 24px",
  fontWeight: "bold",
  textTransform: "none",
});

const VisitingStudents: React.FC<VisitingStudentsProps> = ({ hostelId }) => {
  const [pendingVisits, setPendingVisits] = useState<Visit[]>([]);
  const [newVisitCount, setNewVisitCount] = useState<number>(0);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  useEffect(() => {
    fetchPendingVisits();
    const interval = setInterval(fetchPendingVisits, 60000);
    return () => clearInterval(interval);
  }, [hostelId]);

  const fetchPendingVisits = async () => {
    try {
      const response = await axios.get<Visit[]>(
        `${API_BASE_URL}/api/hostels/${hostelId}/pending-visits`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const newVisits = response.data.map((visit) => ({
        ...visit,
        isNew: !pendingVisits.some((v) => v._id === visit._id),
      }));
      setPendingVisits(newVisits);
      const newCount = newVisits.filter(
        (v) => v.isNew && v.status === "pending"
      ).length;
      setNewVisitCount(newCount);
      if (newCount > 0) {
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error fetching pending visits:", error);
    }
  };

  const handleVisitResponse = async (
    studentId: string,
    response: "accept" | "reject"
  ) => {
    try {
      await axios.post(
        "${API_BASE_URL}/api/hostels/respond-visit",
        { hostelId, studentId, response },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPendingVisits();
    } catch (error) {
      console.error("Error responding to visit:", error);
    }
  };

  const handleCompleteVisit = async (studentId: string) => {
    try {
      await axios.post(
        "${API_BASE_URL}/api/hostels/complete-visit",
        { hostelId, studentId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPendingVisits();
    } catch (error) {
      console.error("Error completing visit:", error);
    }
  };

  const getStatusColor = (
    status: "pending" | "accepted" | "not_interested"
  ) => {
    switch (status) {
      case "pending":
        return "#ffa000";
      case "accepted":
        return "#4caf50";
      case "not_interested":
        return "#f44336";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f0f8ff" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#0288d1", fontWeight: "bold", marginBottom: 4 }}
      >
        Visiting Students
      </Typography>
      <Grid container spacing={4}>
        {pendingVisits.map((visit) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={visit._id}>
            <Badge
              badgeContent={visit.isNew ? "New" : 0}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  right: 20,
                  top: 20,
                  padding: "0 6px",
                  height: 20,
                  minWidth: 20,
                },
              }}
            >
              <GradientCard>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {visit.student
                    ? visit.student.name || "Anonymous"
                    : "Anonymous"}
                </Typography>
                <CardSubtitle>
                  {" phone :"}
                  {visit.student ? visit.student.number || "null" : "No Number"}
                </CardSubtitle>
                <CardSubtitle>
                  Date: {new Date(visit.visitDate).toLocaleDateString()}
                </CardSubtitle>
                <CardSubtitle>Time: {visit.visitTime}</CardSubtitle>
                <Typography
                  sx={{
                    color: getStatusColor(visit.status),
                    fontWeight: "bold",
                    marginTop: 1,
                  }}
                >
                  Status:{" "}
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </Typography>
                <ButtonGroup>
                  {visit.status === "pending" && (
                    <>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleVisitResponse(visit.student!._id, "accept")
                        }
                      >
                        Accept
                      </StyledButton>
                      <StyledButton
                        variant="outlined"
                        color="secondary"
                        onClick={() =>
                          handleVisitResponse(visit.student!._id, "reject")
                        }
                      >
                        Reject
                      </StyledButton>
                    </>
                  )}
                  {visit.status === "accepted" && (
                    <StyledButton
                      variant="contained"
                      color="success"
                      onClick={() => handleCompleteVisit(visit.student!._id)}
                      fullWidth
                    >
                      Complete Visit
                    </StyledButton>
                  )}
                  {visit.status === "not_interested" && (
                    <StyledButton
                      variant="outlined"
                      color="error"
                      disabled
                      fullWidth
                    >
                      Not Interested
                    </StyledButton>
                  )}
                </ButtonGroup>
              </GradientCard>
            </Badge>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          You have {newVisitCount} new visit request(s)!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VisitingStudents;
