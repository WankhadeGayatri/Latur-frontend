// "use client";
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import axios, { AxiosError } from "axios";
// import {
//   Typography,
//   Box,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   IconButton,
//   Switch,
//   FormControlLabel,
//   CircularProgress,
// } from "@mui/material";
// import { Delete as DeleteIcon } from "@mui/icons-material";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { debounce } from "lodash";
// import { FaBed, FaBuilding, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface Feedback {
//   user: string;
//   rating: number;
//   comment: string;
// }
// interface UpdateData extends Omit<Hostel, "_id" | "verified" | "feedback"> {
//   images: (string | File)[];
// }

// interface Hostel {
//   _id: string;
//   name: string;
//   address: string;
//   hostelType: "boys" | "girls";
//   beds: number;
//   studentsPerRoom: number;
//   paymentStatus: "pending" | "paid";
//   number: string;
//   food: boolean;
//   verified: boolean;
//   feedback?: Feedback[];
//   fetchedImages?: { contentType: string; data: string }[];
// }

// interface HostelCardProps {
//   hostel: Hostel;
//   onUpdate: (hostel: Hostel) => void;
//   onDelete: (id: string) => void;
// }

// const HostelCard: React.FC<HostelCardProps> = React.memo(
//   ({ hostel, onUpdate, onDelete }) => (
//     <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 rounded-xl shadow-2xl flex flex-col md:flex-row w-full border border-gray-700 hover:border-cyan-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-cyan-500/20">
//       <div className="md:w-1/3 flex justify-center md:justify-start items-center mb-4 md:mb-0">
//         <Swiper
//           modules={[Navigation, Pagination]}
//           navigation
//           pagination={{ clickable: true }}
//           className="w-full md:w-64 h-48 md:h-auto rounded-lg shadow-lg"
//         >
//           {hostel.fetchedImages && hostel.fetchedImages.length > 0 ? (
//             hostel.fetchedImages.map((image, index) => (
//               <SwiperSlide key={index}>
//                 <img
//                   src={`data:${image.contentType};base64,${image.data}`}
//                   alt={`${hostel.name} - ${index + 1}`}
//                   className="w-full h-full object-cover object-center rounded-lg"
//                 />
//               </SwiperSlide>
//             ))
//           ) : (
//             <SwiperSlide>
//               <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
//                 <p className="text-gray-400">No images available</p>
//               </div>
//             </SwiperSlide>
//           )}
//         </Swiper>
//       </div>
//       <div className="md:w-2/3 md:pl-8 flex flex-col justify-between">
//         <div>
//           <div className="flex justify-between items-start mb-2">
//             <h3 className="text-2xl font-semibold text-cyan-400">
//               {hostel.name}
//             </h3>
//             <div className="space-x-2">
//               <button
//                 onClick={() => onUpdate(hostel)}
//                 className="text-blue-400 hover:text-blue-300 transition-colors"
//               >
//                 <FaEdit />
//               </button>
//               <button
//                 onClick={() => onDelete(hostel._id)}
//                 className="text-red-400 hover:text-red-300 transition-colors"
//               >
//                 <FaTrash />
//               </button>
//             </div>
//           </div>
//           <p className="text-sm text-gray-400 mb-4">{hostel.address}</p>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex items-center gap-3 mb-2">
//               <FaUsers className="text-cyan-400 text-xl" />
//               <p className="text-sm text-gray-300">
//                 <span className="font-semibold text-white">{hostel.beds}</span>{" "}
//                 Beds
//               </p>
//             </div>
//             <div className="flex items-center gap-3 mb-2">
//               <FaBuilding className="text-cyan-400 text-xl" />
//               <p className="text-sm text-gray-300">
//                 <span className="font-semibold text-white">
//                   {hostel.studentsPerRoom}
//                 </span>{" "}
//                 Students/Room
//               </p>
//             </div>
//             <div className="flex items-center gap-3 mb-2">
//               <FaBed className="text-cyan-400 text-xl" />
//               <p className="text-sm text-gray-300">
//                 <span className="font-semibold text-white">
//                   {hostel.paymentStatus}
//                 </span>{" "}
//                 Payment
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <FaBed className="text-cyan-400 text-xl" />
//               <p className="text-sm text-gray-300">
//                 <span className="font-semibold text-white">
//                   {hostel.food ? "Available" : "Not Available"}
//                 </span>{" "}
//                 Food
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-between items-center mt-4">
//           <p className="text-sm text-gray-400">
//             Contact: <span className="text-white">{hostel.number}</span>
//           </p>
//           <div className="flex items-center">
//             <p className="text-sm text-gray-400 mr-2">Verified:</p>
//             <span
//               className={`w-3 h-3 rounded-full ${
//                 hostel.verified ? "bg-green-500" : "bg-red-500"
//               }`}
//             ></span>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// );

// const ViewHostels: React.FC = () => {
//   const [hostels, setHostels] = useState<Hostel[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [openModal, setOpenModal] = useState<boolean>(false);
//   const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
//   const [updateData, setUpdateData] = useState<UpdateData>({
//     name: "",
//     address: "",
//     hostelType: "boys",
//     beds: 0,
//     studentsPerRoom: 0,
//     paymentStatus: "pending",
//     number: "",
//     food: false,
//     images: [],
//   });

//   const fetchOwnerHostels = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const profileId = localStorage.getItem("profileId");
//       const token = localStorage.getItem("token");
//       if (!profileId || !token) throw new Error("Authentication error");

//       const hostelResponse = await axios.get(
//         `https://hostelbackend-tzrj.onrender.com/api/hostels/${profileId}/hostels`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const hostels = hostelResponse.data.hostels;
//       setHostels(hostels);

//       hostels.forEach(async (hostel) => {
//         try {
//           const token = localStorage.getItem("token");
//           const imageResponse = await axios.get(
//             `https://hostelbackend-tzrj.onrender.com/api/hostels/gethostalphotos/${hostel._id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           setHostels((prevHostels) =>
//             prevHostels.map((h) =>
//               h._id === hostel._id
//                 ? { ...h, fetchedImages: imageResponse.data }
//                 : h
//             )
//           );
//         } catch (error) {
//           console.error(
//             `Error fetching images for hostel ${hostel._id}`,
//             error
//           );
//           toast.error(`Failed to load images for hostel ${hostel.name}`);
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching owner's hostels:", error);
//       setError("Failed to fetch hostels. Please try again later.");
//       toast.error("Failed to fetch hostels. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOwnerHostels();
//   }, [fetchOwnerHostels]);

//   const handleUpdateClick = useCallback((hostel: Hostel) => {
//     setSelectedHostel(hostel);
//     setUpdateData({
//       ...hostel,
//       images: hostel.fetchedImages || [],
//     });
//     setOpenModal(true);
//   }, []);

//   const handleCloseModal = useCallback(() => {
//     setOpenModal(false);
//     setSelectedHostel(null);
//   }, []);

//   const handleUpdateHostel = useCallback(async () => {
//     if (!selectedHostel) return;

//     try {
//       const formData = new FormData();
//       Object.entries(updateData).forEach(([key, value]) => {
//         if (Array.isArray(value)) {
//           value.forEach((item) => {
//             if (typeof item === "string" || item instanceof File) {
//               formData.append(`images`, item);
//             }
//           });
//         } else {
//           formData.append(key, value as string);
//         }
//       });
//       const profileId = localStorage.getItem("profileId");
//       const token = localStorage.getItem("token");
//       if (!profileId || !token) throw new Error("Authentication error");

//       await axios.put(
//         `https://hostelbackend-tzrj.onrender.com/api/hostels/update-hostel`,
//         formData, // Updated to use `formData`
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setHostels((prevHostels) =>
//         prevHostels.map((hostel) =>
//           hostel._id === selectedHostel._id
//             ? { ...selectedHostel, ...updateData }
//             : hostel
//         )
//       );

//       handleCloseModal();
//       toast.success("Hostel updated successfully!");
//     } catch (error) {
//       console.error("Error updating hostel:", error);
//       toast.error("Failed to update hostel. Please try again later.");
//     }
//   }, [selectedHostel, updateData, handleCloseModal]);

//   const handleDeleteHostel = useCallback(async (id: string) => {
//     try {
//       const profileId = localStorage.getItem("profileId");
//       const token = localStorage.getItem("token");
//       if (!profileId || !token) throw new Error("Authentication error");

//       await axios.delete(
//         `https://hostelbackend-tzrj.onrender.com/api/hostels/delete/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setHostels((prevHostels) =>
//         prevHostels.filter((hostel) => hostel._id !== id)
//       );
//       toast.success("Hostel deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting hostel:", error);

//       if (axios.isAxiosError(error) && error.response) {
//         toast.error(
//           `Failed to delete hostel: ${
//             error.response.data.message || error.message
//           }`
//         );
//       } else {
//         toast.error("Failed to delete hostel. Please try again later.");
//       }
//     }
//   }, []);

//   const debouncedFetchOwnerHostels = useMemo(
//     () => debounce(fetchOwnerHostels, 300),
//     [fetchOwnerHostels]
//   );

//   useEffect(() => {
//     return () => {
//       debouncedFetchOwnerHostels.cancel();
//     };
//   }, [debouncedFetchOwnerHostels]);

//   return (
//     <div className="flex flex-col items-center space-y-8 mx-8 md:mx-12 lg:mx-24 xl:mx-48 mb-24">
//       <ToastContainer position="top-right" autoClose={5000} />
//       {isLoading ? (
//         <CircularProgress color="primary" />
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : hostels.length === 0 ? (
//         <p className="text-gray-500">No hostels found.</p>
//       ) : (
//         hostels.map((hostel) => (
//           <HostelCard
//             key={hostel._id}
//             hostel={hostel}
//             onUpdate={handleUpdateClick}
//             onDelete={handleDeleteHostel}
//           />
//         ))
//       )}
//       <Dialog
//         open={openModal}
//         onClose={handleCloseModal}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>Update Hostel</DialogTitle>
//         <DialogContent>
//           <Box component="form" noValidate autoComplete="off">
//             <TextField
//               label="Name"
//               fullWidth
//               value={updateData.name}
//               onChange={(e) =>
//                 setUpdateData((prevData) => ({
//                   ...prevData,
//                   name: e.target.value,
//                 }))
//               }
//               margin="normal"
//               variant="outlined"
//             />
//             <TextField
//               label="Address"
//               fullWidth
//               value={updateData.address}
//               onChange={(e) =>
//                 setUpdateData((prevData) => ({
//                   ...prevData,
//                   address: e.target.value,
//                 }))
//               }
//               margin="normal"
//               variant="outlined"
//             />
//             <FormControl fullWidth margin="normal" variant="outlined">
//               <InputLabel>Hostel Type</InputLabel>
//               <Select
//                 value={updateData.hostelType}
//                 onChange={(e) =>
//                   setUpdateData((prevData) => ({
//                     ...prevData,
//                     hostelType: e.target.value as "boys" | "girls",
//                   }))
//                 }
//                 label="Hostel Type"
//               >
//                 <MenuItem value="boys">Boys</MenuItem>
//                 <MenuItem value="girls">Girls</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               label="Beds"
//               fullWidth
//               type="number"
//               value={updateData.beds}
//               onChange={(e) =>
//                 setUpdateData((prevData) => ({
//                   ...prevData,
//                   beds: Number(e.target.value),
//                 }))
//               }
//               margin="normal"
//               variant="outlined"
//             />
//             <TextField
//               label="Students Per Room"
//               fullWidth
//               type="number"
//               value={updateData.studentsPerRoom}
//               onChange={(e) =>
//                 setUpdateData((prevData) => ({
//                   ...prevData,
//                   studentsPerRoom: Number(e.target.value),
//                 }))
//               }
//               margin="normal"
//               variant="outlined"
//             />

//             <FormControl fullWidth margin="normal" variant="outlined">
//               <InputLabel>Payment Status</InputLabel>
//               <Select
//                 value={updateData.paymentStatus}
//                 onChange={(e) =>
//                   setUpdateData((prevData) => ({
//                     ...prevData,
//                     paymentStatus: e.target.value as "pending" | "paid",
//                   }))
//                 }
//                 label="Payment Status"
//               >
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="paid">Paid</MenuItem>
//               </Select>
//             </FormControl>
//             <TextField
//               label="Contact Number"
//               fullWidth
//               value={updateData.number}
//               onChange={(e) =>
//                 setUpdateData((prevData) => ({
//                   ...prevData,
//                   number: e.target.value,
//                 }))
//               }
//               margin="normal"
//               variant="outlined"
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={updateData.food}
//                   onChange={(e) =>
//                     setUpdateData((prevData) => ({
//                       ...prevData,
//                       food: e.target.checked,
//                     }))
//                   }
//                   name="food"
//                   color="primary"
//                 />
//               }
//               label="Food Available"
//             />
//             <TextField
//               label="Images"
//               fullWidth
//               type="file"
//               onChange={(e) => {
//                 if (e.target.files) {
//                   setUpdateData((prevData) => ({
//                     ...prevData,
//                     images: [...prevData.images, ...Array.from(e.target.files)],
//                   }));
//                 }
//               }}
//               margin="normal"
//               variant="outlined"
//               inputProps={{ multiple: true }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpdateHostel}
//             color="primary"
//             variant="contained"
//           >
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ViewHostels;
