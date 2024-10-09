// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { CalendarIcon, ClockIcon, HomeIcon } from "lucide-react";

// interface Visit {
//   _id: string;
//   hostel: {
//     _id: string;
//     name: string;
//     address: string;
//   };
//   visitDate: string;
//   visitTime: string;
//   status: string;
// }

// const Visits: React.FC = () => {
//   const [visits, setVisits] = useState<Visit[]>([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedHostel, setSelectedHostel] = useState<{
//     _id: string;
//     name: string;
//   } | null>(null);
//   const [visitDate, setVisitDate] = useState("");
//   const [visitTime, setVisitTime] = useState("");
//   const [studentEmail, setStudentEmail] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "info" as "info" | "success" | "error",
//   });

//   useEffect(() => {
//     fetchVisits();
//   }, []);

//   const fetchVisits = async () => {
//     try {
//       const profileId = localStorage.getItem("profileId");
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:5000/api/students/${profileId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("hostel visit", response.data);
//       setVisits(response.data.hostelVisits);
//     } catch (error) {
//       console.error("Error fetching visits:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to fetch visits",
//         severity: "error",
//       });
//     }
//   };

//   const handleOpenDialog = (
//     hostel: { _id: string; name: string } | null,
//     visit?: Visit
//   ) => {
//     setSelectedHostel(hostel);
//     if (visit) {
//       setVisitDate(visit.visitDate);
//       setVisitTime(visit.visitTime);
//     } else {
//       setVisitDate("");
//       setVisitTime("");
//     }
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedHostel(null);
//     setVisitDate("");
//     setVisitTime("");
//     setStudentEmail("");
//   };

//   const handleSubmitVisit = async () => {
//     if (!selectedHostel) return;

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/students/request-visit",
//         {
//           hostelId: selectedHostel._id,
//           visitDate,
//           visitTime,
//           studentEmail,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSnackbar({
//         open: true,
//         message: "Visit request submitted successfully",
//         severity: "success",
//       });
//       fetchVisits();
//       handleCloseDialog();
//     } catch (error) {
//       console.error("Error submitting visit request:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to submit visit request",
//         severity: "error",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 p-8">
//       <Typography
//         variant="h4"
//         className="text-sky-800 font-bold mb-6 text-center"
//       >
//         My Hostel Visits
//       </Typography>
//       <TableContainer
//         component={Paper}
//         className="shadow-lg rounded-lg overflow-hidden"
//       >
//         <Table>
//           <TableHead className="bg-sky-700">
//             <TableRow>
//               <TableCell className="text-white font-semibold">Hostel</TableCell>
//               <TableCell className="text-white font-semibold">
//                 Address
//               </TableCell>
//               <TableCell className="text-white font-semibold">Date</TableCell>
//               <TableCell className="text-white font-semibold">Time</TableCell>
//               <TableCell className="text-white font-semibold">Status</TableCell>
//               <TableCell className="text-white font-semibold">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {visits.map((visit) => (
//               <TableRow
//                 key={visit._id}
//                 className="hover:bg-sky-50 transition-colors duration-150"
//               >
//                 <TableCell>{visit.hostel.name}</TableCell>
//                 <TableCell>{visit.hostel.address}</TableCell>
//                 <TableCell className="flex items-center">
//                   <CalendarIcon size={16} className="mr-2 text-sky-600" />
//                   {new Date(visit.visitDate).toLocaleDateString()}
//                 </TableCell>
//                 <TableCell className="flex items-center">
//                   <ClockIcon size={16} className="mr-2 text-sky-600" />
//                   {visit.visitTime}
//                 </TableCell>
//                 <TableCell>
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-semibold
//                     ${
//                       visit.status === "pending"
//                         ? "bg-yellow-100 text-yellow-800"
//                         : "bg-green-100 text-green-800"
//                     }`}
//                   >
//                     {visit.status}
//                   </span>
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     onClick={() => handleOpenDialog(visit.hostel, visit)}
//                     className="text-sky-600 border-sky-600 hover:bg-sky-50"
//                   >
//                     Update Visit
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Button
//         variant="contained"
//         onClick={() => handleOpenDialog(null)}
//         className="mt-4 bg-sky-600 hover:bg-sky-700"
//       >
//         Schedule New Visit
//       </Button>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle className="bg-sky-700 text-white">
//           {selectedHostel
//             ? `Update Visit for ${selectedHostel.name}`
//             : "Schedule New Visit"}
//         </DialogTitle>
//         <DialogContent className="mt-4">
//           {!selectedHostel && (
//             <TextField
//               label="Hostel ID"
//               fullWidth
//               value={selectedHostel?._id || ""}
//               onChange={(e) =>
//                 setSelectedHostel({ _id: e.target.value, name: "" })
//               }
//               className="mb-4"
//             />
//           )}
//           <TextField
//             label="Date"
//             type="date"
//             fullWidth
//             value={visitDate}
//             onChange={(e) => setVisitDate(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             className="mb-4"
//           />
//           <TextField
//             label="Time"
//             type="time"
//             fullWidth
//             value={visitTime}
//             onChange={(e) => setVisitTime(e.target.value)}
//             InputLabelProps={{ shrink: true }}
//             className="mb-4"
//           />
//           <TextField
//             label="Your Email"
//             type="email"
//             fullWidth
//             value={studentEmail}
//             onChange={(e) => setStudentEmail(e.target.value)}
//             className="mb-4"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSubmitVisit}
//             color="primary"
//             variant="contained"
//           >
//             {selectedHostel ? "Update Visit" : "Schedule Visit"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };

// export default Visits;
