"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { API_BASE_URL } from "@/config/api";

interface Complaint {
  _id: string;
  complaintType: string;
  status: "open" | "resolved" | "noticed";
  description: string;
}

interface Student {
  _id: string;
  name: string;
  number: string;
  class: string;
  year: string;
  school: string;
  parentnumber: string;
  parentname: string;
  college: string;
  city: string;
  address: string;
  wishlistSubmitted: boolean;
  wishlistApproved: boolean;
  cashbackApplied: boolean;
  admittedHostel: string;
  complaints: Complaint[];
  admissionReceipt?: any;
}
interface Hostel {
  _id: string;
  name: string;
  admittedStudents: Student[];
}

interface AdmittedStudentsProps {
  hostelId: string;
}

const AdmittedStudents: React.FC<AdmittedStudentsProps> = ({ hostelId }) => {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    if (!hostelId) {
      console.error("Hostel ID is not provided.");
      return;
    }

    const fetchAdmittedStudents = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/hostels/${hostelId}/admitted-students`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setHostel(response.data);
      } catch (error) {
        console.error("Error fetching admitted students:", error);
      }
    };

    fetchAdmittedStudents();
  }, [hostelId]);

  const applyCashback = async (studentId: string) => {
    if (!studentId || !hostelId) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/hostels/apply-cashback`,
        { studentId, hostelId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Cashback applied successfully!");
      // Refresh the data after applying cashback
      const response = await axios.get(
        `${API_BASE_URL}/api/hostels/${hostelId}/admitted-students`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setHostel(response.data);
    } catch (error) {
      console.error("Error applying cashback:", error);
      alert("Failed to apply cashback. Please try again.");
    }
  };

  const fetchComplaints = async (studentId: string) => {
    if (!studentId) return;
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/students/complaints/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const student = hostel?.admittedStudents.find((s) => s._id === studentId);
      if (student) {
        setSelectedStudent({ ...student, complaints: response.data });
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };
  const handleViewReceipt = (student: Student) => {
    console.log("Viewing receipt for student:", student);
    console.log("Admission Receipt:", student.admissionReceipt);

    if (!student.admissionReceipt) {
      alert("No admission receipt available for this student.");
      return;
    }

    try {
      let imageUrl: string | null = null;

      if (typeof student.admissionReceipt === "string") {
        imageUrl = student.admissionReceipt.startsWith("data:")
          ? student.admissionReceipt
          : `data:image/jpeg;base64,${student.admissionReceipt}`;
      } else if (
        student.admissionReceipt &&
        typeof student.admissionReceipt === "object"
      ) {
        if (
          student.admissionReceipt.contentType &&
          student.admissionReceipt.data
        ) {
          imageUrl = `data:${student.admissionReceipt.contentType};base64,${student.admissionReceipt.data}`;
        } else if (student.admissionReceipt.binaryAdmitReceipt) {
          imageUrl = `data:image/jpeg;base64,${student.admissionReceipt.binaryAdmitReceipt}`;
        }
      }

      if (imageUrl) {
        setSelectedReceipt(imageUrl);
        setOpenReceiptModal(true);
      } else {
        throw new Error("Unable to generate image URL from receipt data");
      }
    } catch (error) {
      console.error("Error processing receipt data:", error);
    }
  };

  if (!hostel) {
    return <Typography>Loading...</Typography>;
  }
  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setOpenDetailsDialog(true);
  };

  if (!hostel) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2 }}>
      <Typography variant="h4" sx={{ color: "black", mb: 4 }}>
        Admitted Students for {hostel.name}
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "white" }}>
        <Table sx={{ minWidth: 650 }} aria-label="admitted students table">
          <TableHead sx={{ bgcolor: "gray" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Photo</TableCell>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Contact</TableCell>
              {/* <TableCell sx={{ color: "white" }}>Parent Name</TableCell>
              <TableCell sx={{ color: "white" }}>Parent Number</TableCell> */}
              {/* <TableCell sx={{ color: "white" }}>Education</TableCell> */}
              {/* <TableCell sx={{ color: "white" }}>Location</TableCell> */}
              <TableCell sx={{ color: "white" }}>Documents</TableCell>
              <TableCell sx={{ color: "white" }}>Cashback</TableCell>
              <TableCell sx={{ color: "white" }}>Complaints</TableCell>
              <TableCell sx={{ color: "white" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hostel.admittedStudents.map((student) => (
              <TableRow
                key={student._id}
                sx={{
                  borderBottom: "1px solid gray",
                }}
              >
                <TableCell>
                  <Avatar
                    src={`${API_BASE_URL}/api/students/getphoto/${student._id}`}
                    alt={student.name}
                    sx={{ width: 56, height: 56 }}
                  />
                </TableCell>
                <TableCell sx={{ color: "black" }}>
                  <Typography variant="subtitle1">{student.name}</Typography>
                </TableCell>
                <TableCell sx={{ color: "black" }}>
                  <Typography variant="body2">{student.number}</Typography>
                </TableCell>
                {/* <TableCell sx={{ color: "black" }}>
                  <Typography variant="body2">
                    {student.parentname || "None"}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: "black" }}>
                  <Typography variant="body2">
                    {student.parentnumber || "None"}
                  </Typography>
                </TableCell> */}

                {/* <TableCell sx={{ color: "black" }}>
                  <Typography variant="body2">
                    Class: {student.class}, Year: {student.year}
                  </Typography>
                  <Typography variant="body2">{student.college}</Typography>
                  <Typography variant="body2">{student.school}</Typography>
                </TableCell> */}
                {/* <TableCell sx={{ color: "black" }}>
                  <Typography variant="body2">{student.city}</Typography>
                  <Typography variant="body2">{student.address}</Typography>
                </TableCell> */}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewReceipt(student)}
                    sx={{ color: "black", borderColor: "gray" }}
                    disabled={!student.admissionReceipt}
                  >
                    {student.admissionReceipt ? "View Receipt" : "No Receipt"}
                  </Button>
                </TableCell>
                <TableCell>
                  {student.cashbackApplied ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Applied"
                      color="success"
                      variant="outlined"
                      sx={{ color: "green", borderColor: "gray" }}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => applyCashback(student._id)}
                      startIcon={<PendingIcon />}
                      disabled={!student.admissionReceipt}
                      sx={{
                        bgcolor: "#00ADB5",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#00919B",
                        },
                      }}
                    >
                      Apply Cashback
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleViewDetails(student)}
                    sx={{
                      bgcolor: "#00ADB5",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#00919B",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => fetchComplaints(student._id)}
                    sx={{
                      bgcolor: "white",
                      color: "black",
                      "&:hover": {
                        bgcolor: "#00919B",
                      },
                    }}
                  >
                    View Complaints
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        PaperProps={{
          style: {
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#0077be",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Student Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedStudent && (
            <List>
              <ListItem>
                <ListItemText primary="Name" secondary={selectedStudent.name} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Contact"
                  secondary={selectedStudent.number}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Parent Name"
                  secondary={selectedStudent.parentname || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Parent Number"
                  secondary={selectedStudent.parentnumber || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Class"
                  secondary={selectedStudent.class}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Year" secondary={selectedStudent.year} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="School"
                  secondary={selectedStudent.school}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="College"
                  secondary={selectedStudent.college || "N/A"}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="City" secondary={selectedStudent.city} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={selectedStudent.address}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openReceiptModal}
        onClose={() => {
          setOpenReceiptModal(false);
          setSelectedReceipt(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "#0077be", color: "white" }}>
          Admission Receipt
        </DialogTitle>
        <DialogContent>
          {selectedReceipt && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <img
                src={selectedReceipt}
                alt="Admission Receipt"
                style={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          style: {
            borderRadius: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#0077be",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 3,
          }}
        >
          {/* <Avatar sx={{ bgcolor: "white" }}>
            <DocumentReportIcon color="primary" />
          </Avatar> */}
          <Typography variant="h5" fontWeight="bold">
            Complaints of {selectedStudent?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {(selectedStudent?.complaints?.length ?? 0) === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <CheckCircleIcon
                sx={{ fontSize: 60, color: "success.main", mb: 2 }}
              />
              <Typography variant="h6">No complaints</Typography>
              <Typography color="text.secondary">
                This student has a clean record!
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {selectedStudent?.complaints.map((complaint, index) => (
                <React.Fragment key={complaint._id}>
                  <ListItem alignItems="flex-start" sx={{ py: 3, px: 3 }}>
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary" gutterBottom>
                          {complaint.complaintType}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            paragraph
                          >
                            {complaint.description}
                          </Typography>
                          <Chip
                            label={complaint.status}
                            color={
                              complaint.status === "resolved"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < selectedStudent.complaints.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdmittedStudents;
