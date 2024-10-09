"use client";
import React, { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  AlertColor,
} from "@mui/material";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

interface Hostel {
  _id: string;
  id: string;
  name: string;
  address: string;
  hostelType: string;
  beds: number;
  food: boolean;
  verified: boolean;
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  owner: {
    id: string;
    name: string;
    number: string;
  };
}

interface HostelVisit {
  hostel: Hostel;
  visitDate: string;
  visitTime: string;
  status: string;
}

interface Student {
  _id: string;
  name: string;
  wishlistSubmitted: boolean;
  wishlistApproved: boolean;
  admittedHostel: { _id: string } | null;
  hostelVisits: HostelVisit[];
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const Visits: React.FC = () => {
  const [wishlist, setWishlist] = useState<Hostel[]>([]);
  const [student, setStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [visitDate, setVisitDate] = useState<string>("");
  const [visitTime, setVisitTime] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");

      if (!profileId || !token) {
        throw new Error("Profile ID or token not found");
      }

      const [studentResponse, wishlistResponse] = await Promise.all([
        axios.get<Student>(`${API_BASE_URL}/api/students/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get<Hostel[]>(
          `${API_BASE_URL}/api/students/wishlist/${profileId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      setStudent(studentResponse.data);
      setWishlist(wishlistResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch data",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (hostel: Hostel, visit?: HostelVisit): void => {
    setSelectedHostel(hostel);
    if (visit) {
      setVisitDate(new Date(visit.visitDate).toISOString().split("T")[0]);
      setVisitTime(visit.visitTime);
    } else {
      setVisitDate("");
      setVisitTime("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = (): void => {
    setOpenDialog(false);
    setSelectedHostel(null);
    setVisitDate("");
    setVisitTime("");
    setStudentEmail("");
  };

  const handleSubmitVisit = async (): Promise<void> => {
    if (!selectedHostel) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axios.post(
        `${API_BASE_URL}/api/students/request-visit`,
        {
          hostelId: selectedHostel._id,
          visitDate,
          visitTime,
          studentEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Visit request submitted successfully",
        severity: "success",
      });
      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error("Error submitting visit request:", error);
      setSnackbar({
        open: true,
        message: "Failed to submit visit request",
        severity: "error",
      });
    }
  };

  const isVisitScheduled = (hostelId: string): boolean => {
    return (
      student?.hostelVisits.some((visit) => visit.hostel.id === hostelId) ||
      false
    );
  };

  const getVisitInfo = (hostelId: string): HostelVisit | undefined => {
    return student?.hostelVisits.find((visit) => visit.hostel.id === hostelId);
  };

  const takeAdmission = async (hostelId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axios.post(
        `${API_BASE_URL}/api/students/take-admission`,
        { hostelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Admission taken successfully",
        severity: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Error taking admission:", error);
      setSnackbar({
        open: true,
        message: "Failed to take admission",
        severity: "error",
      });
    }
  };

  const markAsNotInterested = async (hostelId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");

      await axios.post(
        `${API_BASE_URL}/api/students/not-interested`,
        { hostelId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({
        open: true,
        message: "Marked as not interested",
        severity: "success",
      });
      fetchData();
    } catch (error) {
      console.error("Error marking as not interested:", error);
      setSnackbar({
        open: true,
        message: "Failed to mark as not interested",
        severity: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 p-8">
      <Typography
        variant="h4"
        className="text-sky-800 font-bold mb-6 text-center"
      >
        My Hostel Visits
      </Typography>
      <TableContainer
        component={Paper}
        className="shadow-lg rounded-lg overflow-hidden mb-8"
      >
        <Table>
          <TableHead className="bg-sky-700">
            <TableRow>
              <TableCell className="text-white font-semibold">Hostel</TableCell>
              <TableCell className="text-white font-semibold">
                Address
              </TableCell>
              <TableCell className="text-white font-semibold">
                Visit Date
              </TableCell>
              <TableCell className="text-white font-semibold">
                Visit Time
              </TableCell>
              <TableCell className="text-white font-semibold">Status</TableCell>
              <TableCell className="text-white font-semibold">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wishlist.map((hostel) => {
              const visitInfo = getVisitInfo(hostel._id);
              return (
                <TableRow
                  key={hostel.id}
                  className="hover:bg-sky-50 transition-colors duration-150"
                >
                  <TableCell>{hostel.name}</TableCell>
                  <TableCell>{hostel.address}</TableCell>
                  <TableCell>
                    {visitInfo && (
                      <>
                        <CalendarIcon
                          size={16}
                          className="inline-block mr-1 text-sky-600"
                        />
                        {new Date(visitInfo.visitDate).toLocaleDateString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {visitInfo && (
                      <>
                        <ClockIcon
                          size={16}
                          className="inline-block mr-1 text-sky-600"
                        />
                        {visitInfo.visitTime}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {visitInfo && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          visitInfo.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {visitInfo.status}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student?.wishlistSubmitted &&
                      student.wishlistApproved &&
                      !student.admittedHostel && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenDialog(hostel, visitInfo)}
                            className="text-sky-600 border-sky-600 hover:bg-sky-50 mr-2"
                          >
                            {isVisitScheduled(hostel._id)
                              ? "Update Visit"
                              : "Schedule Visit"}
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => takeAdmission(hostel._id)}
                            className="bg-sky-600 hover:bg-sky-700 mr-2"
                          >
                            Take Admission
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => markAsNotInterested(hostel._id)}
                            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                          >
                            Not Interested
                          </Button>
                        </>
                      )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle className="bg-sky-700 text-white">
          {selectedHostel
            ? `${
                isVisitScheduled(selectedHostel.id) ? "Update" : "Schedule"
              } Visit for ${selectedHostel.name}`
            : "Schedule New Visit"}
        </DialogTitle>
        <DialogContent className="mt-4">
          <TextField
            label="Date"
            type="date"
            fullWidth
            value={visitDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVisitDate(e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />
          <TextField
            label="Time"
            type="time"
            fullWidth
            value={visitTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVisitTime(e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            className="mb-4"
          />
          <TextField
            label="Your Email"
            type="email"
            fullWidth
            value={studentEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStudentEmail(e.target.value)
            }
            className="mb-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitVisit}
            color="primary"
            variant="contained"
          >
            {isVisitScheduled(selectedHostel?.id || "")
              ? "Update Visit"
              : "Schedule Visit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Visits;
