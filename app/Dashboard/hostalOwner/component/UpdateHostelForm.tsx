import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
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
  Button,
  Box,
  Typography,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/config/api";
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

interface Feedback {
  rating: number;
  comment: string;
  date: string;
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
interface HostelImage {
  data: { type: string; data: number[] };
  contentType: string;
  _id: string;
}
type NewFileWithPreview = {
  file: File;
  preview: string;
};

type HostelImageOrNew = HostelImage | NewFileWithPreview;

type HostelType = "boys" | "girls";
type PaymentStatus = "pending" | "paid";

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

interface UpdateHostelFormProps {
  hostel: Hostel;
  onClose: () => void;
  onUpdate: (updatedHostel: Hostel) => void;
}

type UpdateData = Omit<Hostel, "images"> & {
  images: HostelImageOrNew[];
};

type UpdateHostelData = Omit<Hostel, "feedback" | "complaints" | "images"> & {
  images: HostelImageOrNew[];
};

const UpdateHostelForm: React.FC<UpdateHostelFormProps> = ({
  hostel,
  onClose,
  onUpdate,
}) => {
  const [updateData, setUpdateData] = useState<UpdateHostelData>({
    ...hostel,
    images: hostel.images || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateHostel = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append all updateData fields to formData
      Object.entries(updateData).forEach(([key, value]) => {
        if (key === "images") {
          // Handle existing images
          const existingImageIds = updateData.images
            .filter((img): img is HostelImage => !("file" in img))
            .map((img) => img._id);
          formData.append("existingImages", JSON.stringify(existingImageIds));

          // Handle new images
          updateData.images.forEach((image) => {
            if ("file" in image && image.file instanceof File) {
              formData.append(`images`, image.file);
            }
          });
        } else if (key === "rentStructure" || key === "mealOptions") {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      formData.append("hostelId", hostel._id);

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

      onUpdate(response.data);
      onClose();
      toast.success("Hostel updated successfully!");
    } catch (error) {
      console.error("Error updating hostel:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to update hostel: ${error.response.data.error}`);
      } else {
        toast.error("Failed to update hostel. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [updateData, hostel._id, onUpdate, onClose, isSubmitting]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: NewFileWithPreview[] = Array.from(e.target.files).map(
        (file) => ({
          file,
          preview: URL.createObjectURL(file),
        })
      );
      setUpdateData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setUpdateData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (
    field: keyof UpdateData,
    value: string | number | boolean
  ) => {
    setUpdateData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRentStructureChange = (
    index: number,
    field: Exclude<keyof RentStructure, "_id">,
    value: number
  ) => {
    setUpdateData((prev) => {
      const newRentStructure = prev.rentStructure.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return { ...prev, rentStructure: newRentStructure };
    });
  };

  const handleMealOptionsChange = (event: SelectChangeEvent<string[]>) => {
    setUpdateData((prev) => ({
      ...prev,
      mealOptions: event.target.value as string[],
    }));
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="bg-gradient-to-r from-sky-400 to-blue-500 text-white">
        Update Hostel
      </DialogTitle>
      <DialogContent className="bg-white">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          className="space-y-4 mt-4"
        >
          <TextField
            label="Name"
            fullWidth
            value={updateData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
            variant="outlined"
          />
          <TextField
            label="Address"
            fullWidth
            value={updateData.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateData({ ...updateData, address: e.target.value })
            }
            variant="outlined"
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Hostel Type</InputLabel>
            <Select
              value={updateData.hostelType}
              onChange={(e: SelectChangeEvent<string>) =>
                setUpdateData({
                  ...updateData,
                  hostelType: e.target.value as "boys" | "girls",
                })
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateData({ ...updateData, beds: Number(e.target.value) })
            }
            variant="outlined"
          />
          <TextField
            label="Students Per Room"
            fullWidth
            type="number"
            value={updateData.studentsPerRoom}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateData({
                ...updateData,
                studentsPerRoom: Number(e.target.value),
              })
            }
            variant="outlined"
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={updateData.paymentStatus}
              onChange={(e: SelectChangeEvent<string>) =>
                setUpdateData({
                  ...updateData,
                  paymentStatus: e.target.value as "pending" | "paid",
                })
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateData({ ...updateData, number: e.target.value })
            }
            variant="outlined"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.food}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUpdateData({ ...updateData, food: e.target.checked })
                }
                color="primary"
              />
            }
            label="Food Available"
          />
          {updateData.food && (
            <>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Food Type</InputLabel>
                <Select
                  value={updateData.foodType}
                  onChange={(e: SelectChangeEvent<string>) =>
                    setUpdateData({ ...updateData, foodType: e.target.value })
                  }
                  label="Food Type"
                >
                  <MenuItem value="veg">Vegetarian</MenuItem>
                  <MenuItem value="nonveg">Non-Vegetarian</MenuItem>
                  <MenuItem value="both">Both</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Meal Options</InputLabel>
                <Select
                  multiple
                  value={updateData.mealOptions || []}
                  onChange={(e: SelectChangeEvent<string[]>) =>
                    setUpdateData({
                      ...updateData,
                      mealOptions: e.target.value as string[],
                    })
                  }
                  label="Meal Options"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={updateData.wifi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUpdateData({ ...updateData, wifi: e.target.checked })
                }
                color="primary"
              />
            }
            label="Wi-Fi Available"
          />

          <FormControlLabel
            control={
              <Switch
                checked={updateData.ac}
                onChange={(e) =>
                  setUpdateData({ ...updateData, ac: e.target.checked })
                }
                color="primary"
              />
            }
            label="AC Available"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.mess}
                onChange={(e) =>
                  setUpdateData({ ...updateData, mess: e.target.checked })
                }
                color="primary"
              />
            }
            label="Mess Available"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.solar}
                onChange={(e) =>
                  setUpdateData({ ...updateData, solar: e.target.checked })
                }
                color="primary"
              />
            }
            label="Solar Power Available"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.studyRoom}
                onChange={(e) =>
                  setUpdateData({ ...updateData, studyRoom: e.target.checked })
                }
                color="primary"
              />
            }
            label="Study Room Available"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.tuition}
                onChange={(e) =>
                  setUpdateData({ ...updateData, tuition: e.target.checked })
                }
                color="primary"
              />
            }
            label="Tuition Available"
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Kitchen Type</InputLabel>
            <Select
              value={updateData.kitchenType}
              onChange={(e) =>
                setUpdateData({ ...updateData, kitchenType: e.target.value })
              }
              label="Kitchen Type"
            >
              <MenuItem value="inHouse">In-House</MenuItem>
              <MenuItem value="Outsourced">Outsourced</MenuItem>
              <MenuItem value="Not available">Not available</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h6" gutterBottom className="text-sky-700">
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRentStructureChange(
                    index,
                    "studentsPerRoom",
                    Number(e.target.value)
                  )
                }
                variant="outlined"
                className="mr-2"
              />
              <TextField
                label="Rent per Student"
                type="number"
                value={rent.rentPerStudent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleRentStructureChange(
                    index,
                    "rentPerStudent",
                    Number(e.target.value)
                  )
                }
                variant="outlined"
                className="mr-2"
              />
              <IconButton
                onClick={() => {
                  setUpdateData((prev) => ({
                    ...prev,
                    rentStructure: prev.rentStructure.filter(
                      (_, i) => i !== index
                    ),
                  }));
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              const newRentStructure: RentStructure = {
                studentsPerRoom: 1,
                rentPerStudent: 0,
                _id: Date.now().toString(),
              };
              setUpdateData((prev) => ({
                ...prev,
                rentStructure: [...prev.rentStructure, newRentStructure],
              }));
            }}
            variant="outlined"
            className="mt-2"
          >
            Add Rent Structure
          </Button>

          <Typography variant="h6" gutterBottom className="text-sky-700">
            Images
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {updateData.images.map((image, index) => (
              <Box key={index} position="relative">
                <img
                  src={
                    "preview" in image
                      ? image.preview
                      : `data:${image.contentType};base64,${image.data}`
                  }
                  alt={`Hostel image ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "white",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mt-4"
          />
        </Box>
      </DialogContent>
      <DialogActions className="bg-gray-100">
        <Button
          onClick={onClose}
          className="text-gray-600"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateHostel}
          className="bg-gradient-to-r from-sky-400 to-blue-500 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateHostelForm;
