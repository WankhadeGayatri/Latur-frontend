"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
import axios, { AxiosError } from "axios";
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import debounce from "lodash/debounce";
import {
  FaBed,
  FaBuilding,
  FaEdit,
  FaTrash,
  FaUsers,
  FaMoneyBillWave,
  FaInfoCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HostelDetailsModal from "./HostelDetailsModal";
import HostelCard from "./HostelCard";
import { API_BASE_URL } from "@/config/api";

interface Feedback {
  rating: number;
  comment: string;
  date: string;
}

interface ExistingRentStructure {
  _id: string;
  studentsPerRoom: number;
  rentPerStudent: number;
}

interface NewRentStructure {
  studentsPerRoom: number;
  rentPerStudent: number;
}

type RentStructure = ExistingRentStructure | NewRentStructure;

interface HostelImage {
  data: { type: string; data: number[] };
  contentType: string;
  _id: string;
}

interface Hostel {
  _id: string;
  name: string;
  owner: string;
  address: string;
  hostelType: "boys" | "girls";
  beds: number;
  studentsPerRoom: number;
  paymentStatus: "pending" | "paid";
  number: string;
  food: boolean;
  verified: boolean;
  feedback?: Feedback[];
  fetchedImages?: { contentType: string; data: string }[];
  rentStructure: RentStructure[];
  images: HostelImage[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  kitchenType: string;
  registerDate: string;
  pendingVisits: PendingVisit[];
  complaints: Complaint[];
  latitude: number;
  longitude: number;
  foodType?: string;
  mealOptions?: string[];
}

interface PendingVisit {
  student: string;
  visitDate: Date;
  visitTime: string;
}

interface Complaint {
  student: string;
  description: string;
  isAnonymous: boolean;
  images: {
    data: string;
    contentType: string;
  }[];
  date: Date;
  status: string;
  complaintType: string;
}

interface UpdateData {
  name: string;
  owner: string;
  address: string;
  hostelType: "boys" | "girls";
  beds: number;
  studentsPerRoom: number;
  paymentStatus: "pending" | "paid";
  number: string;
  food: boolean;
  images: (string | File)[];
  rentStructure: RentStructure[];
  wifi: boolean;
  ac: boolean;
  mess: boolean;
  solar: boolean;
  studyRoom: boolean;
  tuition: boolean;
  kitchenType: string;
  registerDate: string;
  pendingVisits: PendingVisit[];
  complaints: Complaint[];
  latitude: number;
  longitude: number;
}

interface HostelCardProps {
  hostel: Hostel;
  onUpdate: (hostel: Hostel) => void;
  onDelete: (id: string) => void;
}

const ViewHostels: React.FC = () => {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [updateData, setUpdateData] = useState<UpdateData>({
    name: "",
    address: "",
    hostelType: "boys",
    beds: 0,
    studentsPerRoom: 0,
    paymentStatus: "pending",
    number: "",
    food: false,
    images: [],
    rentStructure: [],
    owner: "",
    wifi: false,
    ac: false,
    mess: false,
    solar: false,
    studyRoom: false,
    tuition: false,
    kitchenType: "",
    registerDate: "",
    pendingVisits: [],
    complaints: [],
    latitude: 0,
    longitude: 0,
  });

  const fetchOwnerHostels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!profileId || !token) throw new Error("Authentication error");

      const hostelResponse = await axios.get<{ hostels: Hostel[] }>(
        `${API_BASE_URL}/api/hostels/${profileId}/hostels`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchedHostels = hostelResponse.data.hostels;
      setHostels(fetchedHostels);

      await Promise.all(
        fetchedHostels.map(async (hostel) => {
          try {
            const imageResponse = await axios.get<
              { contentType: string; data: string }[]
            >(`${API_BASE_URL}/api/hostels/gethostalphotos/${hostel._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setHostels((prevHostels) =>
              prevHostels.map((h) =>
                h._id === hostel._id
                  ? { ...h, fetchedImages: imageResponse.data }
                  : h
              )
            );
          } catch (error) {
            console.error(
              `Error fetching images for hostel ${hostel._id}`,
              error
            );
            toast.error(`Failed to load images for hostel ${hostel.name}`);
          }
        })
      );
    } catch (error) {
      console.error("Error fetching owner's hostels:", error);
      setError("Failed to fetch hostels. Please try again later.");
      toast.error("Failed to fetch hostels. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerHostels();
  }, [fetchOwnerHostels]);

  const handleUpdateClick = useCallback((hostel: Hostel) => {
    setSelectedHostel(hostel);
    setUpdateData({
      ...hostel,
      images: hostel.fetchedImages
        ? hostel.fetchedImages.map(
            (image) =>
              new File([image.data], `${hostel.name}-${image.contentType}`, {
                type: image.contentType,
              })
          )
        : [],
    });
    setOpenModal(true);
  }, []);

  // Add this new function
  const onUpdate = useCallback(
    (hostel: Hostel) => {
      handleUpdateClick(hostel);
    },
    [handleUpdateClick]
  );

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedHostel(null);
  }, []);

  const handleUpdateHostel = useCallback(async () => {
    if (!selectedHostel) return;

    try {
      const formData = new FormData();
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === "images") {
          (value as (string | File)[]).forEach((item) => {
            if (item instanceof File) {
              formData.append("images", item);
            } else if (typeof item === "string") {
              formData.append("images", item);
            }
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      formData.append("hostelId", selectedHostel._id);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication error");

      const response = await axios.put<Hostel>(
        `${API_BASE_URL}/api/hostels/update-hostel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setHostels((prevHostels) =>
        prevHostels.map((hostel) =>
          hostel._id === selectedHostel._id ? response.data : hostel
        )
      );
      fetchOwnerHostels();
      handleCloseModal();
      toast.success("Hostel updated successfully!");
    } catch (error) {
      console.error("Error updating hostel:", error);
      toast.error("Failed to update hostel. Please try again later.");
    }
  }, [selectedHostel, updateData, handleCloseModal, fetchOwnerHostels]);

  const handleDeleteHostel = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication error");

      await axios.delete(`${API_BASE_URL}/api/hostels/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHostels((prevHostels) =>
        prevHostels.filter((hostel) => hostel._id !== id)
      );
      toast.success("Hostel deleted successfully!");
    } catch (error) {
      console.error("Error deleting hostel:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          `Failed to delete hostel: ${
            error.response.data.message || error.message
          }`
        );
      } else {
        toast.error("Failed to delete hostel. Please try again later.");
      }
    }
  }, []);

  const debouncedFetchOwnerHostels = useCallback(
    debounce(fetchOwnerHostels, 300),
    [fetchOwnerHostels]
  );

  useEffect(() => {
    return () => {
      debouncedFetchOwnerHostels.cancel();
    };
  }, [debouncedFetchOwnerHostels]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: checked }));
  };

  const addRentStructure = useCallback(() => {
    setUpdateData((prevData) => ({
      ...prevData,
      rentStructure: [
        ...prevData.rentStructure,
        { studentsPerRoom: 1, rentPerStudent: 0 },
      ],
    }));
  }, []);

  const updateRentStructure = useCallback(
    (
      index: number,
      field: "studentsPerRoom" | "rentPerStudent",
      value: number
    ) => {
      setUpdateData((prevData) => ({
        ...prevData,
        rentStructure: prevData.rentStructure.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      }));
    },
    []
  );

  const removeRentStructure = useCallback((index: number) => {
    setUpdateData((prevData) => ({
      ...prevData,
      rentStructure: prevData.rentStructure.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <div className="flex flex-col items-center space-y-8 mx-8 md:mx-12 lg:mx-24 xl:mx-48 mb-24">
      <ToastContainer position="top-right" autoClose={5000} />
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : hostels.length === 0 ? (
        <p className="text-gray-500">No hostels found.</p>
      ) : (
        hostels.map((hostel) => (
          <HostelCard
            key={hostel._id}
            hostel={hostel}
            onUpdate={handleUpdateClick}
            onDelete={handleDeleteHostel}
          />
        ))
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Update Hostel</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={updateData.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Address"
              fullWidth
              value={updateData.address}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  address: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Hostel Type</InputLabel>
              <Select
                value={updateData.hostelType}
                onChange={(e) =>
                  setUpdateData((prevData) => ({
                    ...prevData,
                    hostelType: e.target.value as "boys" | "girls",
                  }))
                }
                label="Hostel Type"
              >
                <MenuItem value="boys">Boys</MenuItem>
                <MenuItem value="girls">Girls</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Beds"
              fullWidth
              type="number"
              value={updateData.beds}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  beds: Number(e.target.value),
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <TextField
              label="Students Per Room"
              fullWidth
              type="number"
              value={updateData.studentsPerRoom}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  studentsPerRoom: Number(e.target.value),
                }))
              }
              margin="normal"
              variant="outlined"
            />

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={updateData.paymentStatus}
                onChange={(e) =>
                  setUpdateData((prevData) => ({
                    ...prevData,
                    paymentStatus: e.target.value as "pending" | "paid",
                  }))
                }
                label="Payment Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Contact Number"
              fullWidth
              value={updateData.number}
              onChange={(e) =>
                setUpdateData((prevData) => ({
                  ...prevData,
                  number: e.target.value,
                }))
              }
              margin="normal"
              variant="outlined"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={updateData.food}
                  onChange={(e) =>
                    setUpdateData((prevData) => ({
                      ...prevData,
                      food: e.target.checked,
                    }))
                  }
                  name="food"
                  color="primary"
                />
              }
              label="Food Available"
            />
            <TextField
              label="Images"
              fullWidth
              type="file"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setUpdateData((prevData) => ({
                    ...prevData,
                    images: [
                      ...prevData.images,
                      ...Array.from(e.target.files as FileList),
                    ],
                  }));
                }
              }}
              margin="normal"
              variant="outlined"
              inputProps={{ multiple: true }}
            />

            <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
              Rent Structure
            </Typography>
            {updateData.rentStructure.map((rent, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                marginBottom={2}
              >
                <TextField
                  label="Students per Room"
                  type="number"
                  value={rent.studentsPerRoom}
                  onChange={(e) => {
                    const newRentStructure = [...updateData.rentStructure];
                    newRentStructure[index].studentsPerRoom = Number(
                      e.target.value
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                  margin="dense"
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <TextField
                  label="Rent per Student"
                  type="number"
                  value={rent.rentPerStudent}
                  onChange={(e) => {
                    const newRentStructure = [...updateData.rentStructure];
                    newRentStructure[index].rentPerStudent = Number(
                      e.target.value
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                  margin="dense"
                  variant="outlined"
                  style={{ marginRight: "10px" }}
                />
                <IconButton
                  onClick={() => {
                    const newRentStructure = updateData.rentStructure.filter(
                      (_, i) => i !== index
                    );
                    setUpdateData({
                      ...updateData,
                      rentStructure: newRentStructure,
                    });
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                const newRentStructure = [
                  ...updateData.rentStructure,
                  { studentsPerRoom: 1, rentPerStudent: 0 },
                ];
                setUpdateData({
                  ...updateData,
                  rentStructure: newRentStructure,
                });
              }}
              variant="outlined"
              style={{ marginTop: "10px" }}
            >
              Add Rent Structure
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateHostel}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewHostels;


