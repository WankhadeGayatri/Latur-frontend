"use client";
import React, { useState } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { SelectChangeEvent } from "@mui/material/Select";
import { API_BASE_URL } from "@/config/api";
const API_URL = `${API_BASE_URL}/api/hostels`;

// Define the useHostelApi hook directly in this file
const useHostelApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: API_URL,
  });

  const setAuthToken = (token: string) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/login", { email, password });
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError("Login failed");
      throw err;
    }
  };

  const addHostel = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const profileId = localStorage.getItem("profileId");

    if (!token || !profileId) {
      throw new Error("Authentication required");
    }

    formData.append("_id", profileId);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/hostels/add-hostel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding hostel:", error);
      throw error;
    }
  };

  return {
    loading,
    error,
    setAuthToken,
    login,
    addHostel,
  };
};

const AddHostel: React.FC = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [hostelType, setHostelType] = useState("");
  const [beds, setBeds] = useState(0);
  const [studentsPerRoom, setStudentsPerRoom] = useState(0);

  const [images, setImages] = useState<File[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [wifi, setWifi] = useState(false);
  const [ac, setAc] = useState(false);
  const [mess, setMess] = useState(false);
  const [solar, setSolar] = useState(false);
  const [studyRoom, setStudyRoom] = useState(false);
  const [tuition, setTuition] = useState(false);
  const [kitchenType, setKitchenType] = useState("");
  const [verified, setVerified] = useState(false);
  const { addHostel, loading, error } = useHostelApi();
  const [rentStructure, setRentStructure] = useState<
    Array<{ studentsPerRoom: number; rentPerStudent: number }>
  >([{ studentsPerRoom: 1, rentPerStudent: 0 }]);
  const [food, setFood] = useState(false);
  const [foodType, setFoodType] = useState("");
  const [mealOptions, setMealOptions] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);
      setImageNames(filesArray.map((file) => file.name)); // Store file names
    }
  };

  const handleAddRentStructure = () => {
    setRentStructure([
      ...rentStructure,
      { studentsPerRoom: 1, rentPerStudent: 0 },
    ]);
  };

  const handleRemoveRentStructure = (index: number) => {
    const newRentStructure = rentStructure.filter((_, i) => i !== index);
    setRentStructure(newRentStructure);
  };

  const handleRentStructureChange = (
    index: number,
    field: "studentsPerRoom" | "rentPerStudent",
    value: number
  ) => {
    const newRentStructure = [...rentStructure];
    newRentStructure[index][field] = value;
    setRentStructure(newRentStructure);
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFood(e.target.checked);
    if (!e.target.checked) {
      setFoodType("");
      setMealOptions([]);
    }
  };

  const handleMealOptionsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    if (value.includes("all")) {
      setMealOptions(["all"]);
    } else {
      setMealOptions(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("number", number);
    formData.append("address", address);
    formData.append("hostelType", hostelType);
    formData.append("beds", beds.toString());
    formData.append("studentsPerRoom", studentsPerRoom.toString());
    formData.append("food", food.toString()); // This is the correct way to append boolean values
    if (food) {
      formData.append("foodType", foodType);
      formData.append("mealOptions", JSON.stringify(mealOptions));
    }
    formData.append("rentStructure", JSON.stringify(rentStructure));
    formData.append("wifi", wifi.toString());
    formData.append("ac", ac.toString());
    formData.append("mess", mess.toString());
    formData.append("solar", solar.toString());
    formData.append("studyRoom", studyRoom.toString());
    formData.append("tuition", tuition.toString());
    formData.append("kitchenType", kitchenType);
    formData.append("verified", verified.toString());
    images.forEach((image) => {
      formData.append(`images`, image);
    });

    try {
      const newHostel = await addHostel(formData);
      console.log("Hostel added:", newHostel);
      toast.success("Hostel added successfully!");

      // Reset form fields
      setName("");
      setNumber("");
      setAddress("");
      setHostelType("");
      setBeds(0);
      setStudentsPerRoom(0);
      setFood(false);
      setFoodType("");
      setMealOptions([]);
      setImages([]);
      setImageNames([]);
      setWifi(false);
      setAc(false);
      setMess(false);
      setSolar(false);
      setStudyRoom(false);
      setTuition(false);
      setKitchenType("");
      setVerified(false);
      setRentStructure([{ studentsPerRoom: 1, rentPerStudent: 0 }]);
    } catch (error) {
      console.error("Failed to add hostel:", error);
      toast.error("Failed to add hostel. Please try again.");
    }
  };
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
            maxWidth: 900,
            bgcolor: "white",
            color: "black",
            boxShadow: "0 4px 10px rgba(135, 206, 235, 0.5)",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hostel Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{
                  style: { color: "black", backgroundColor: "white" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{
                  style: { color: "black", backgroundColor: "white" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                variant="outlined"
                multiline
                rows={2}
                margin="normal"
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{
                  style: { color: "black", backgroundColor: "white" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel style={{ color: "black" }}>Hostel Type</InputLabel>
                <Select
                  value={hostelType}
                  onChange={(e) => setHostelType(e.target.value as string)}
                  label="Hostel Type"
                  required
                  style={{ color: "black", backgroundColor: "white" }}
                >
                  <MenuItem value="boys">Boys</MenuItem>
                  <MenuItem value="girls">Girls</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Beds"
                value={beds}
                onChange={(e) => setBeds(parseInt(e.target.value))}
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{ style: { color: "black" } }}
                InputProps={{
                  style: { color: "black", backgroundColor: "white" },
                }}
              />
            </Grid>
            {/* Food-related fields */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
                Food Options
              </Typography>
            </Grid>
            <Grid item xs={12} container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={food}
                      onChange={handleFoodChange}
                      color="primary"
                    />
                  }
                  label="Food Available"
                  style={{ color: "black" }}
                />
              </Grid>
              {food && (
                <>
                  <Grid item xs={12} sm={3}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                    >
                      <InputLabel style={{ color: "black" }}>
                        Food Type
                      </InputLabel>
                      <Select
                        value={foodType}
                        onChange={(e) => setFoodType(e.target.value as string)}
                        label="Food Type"
                        style={{ color: "black", backgroundColor: "white" }}
                      >
                        <MenuItem value="veg">Vegetarian</MenuItem>
                        <MenuItem value="nonveg">Non-Vegetarian</MenuItem>
                        <MenuItem value="both">Both</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      margin="normal"
                      required
                    >
                      <InputLabel style={{ color: "black" }}>
                        Meal Options
                      </InputLabel>
                      <Select
                        multiple
                        value={mealOptions}
                        onChange={handleMealOptionsChange}
                        label="Meal Options"
                        style={{ color: "black", backgroundColor: "white" }}
                        renderValue={(selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
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
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel style={{ color: "black" }}>
                        Kitchen Type
                      </InputLabel>
                      <Select
                        value={kitchenType}
                        onChange={(e) =>
                          setKitchenType(e.target.value as string)
                        }
                        label="Kitchen Type"
                        style={{ color: "black", backgroundColor: "white" }}
                      >
                        <MenuItem value="inHouse">In-House</MenuItem>
                        <MenuItem value="Outsourced">Outsourced</MenuItem>
                        <MenuItem value="Not available">Not available</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wifi}
                    onChange={(e) => setWifi(e.target.checked)}
                    color="primary"
                  />
                }
                label="Wi-Fi Available"
                style={{ color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={ac}
                    onChange={(e) => setAc(e.target.checked)}
                    color="primary"
                  />
                }
                label="AC Available"
                style={{ color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mess}
                    onChange={(e) => setMess(e.target.checked)}
                    color="primary"
                  />
                }
                label="Mess Available"
                style={{ color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={solar}
                    onChange={(e) => setSolar(e.target.checked)}
                    color="primary"
                  />
                }
                label="Solar Power"
                style={{ color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={studyRoom}
                    onChange={(e) => setStudyRoom(e.target.checked)}
                    color="primary"
                  />
                }
                label="Study Room Available"
                style={{ color: "black" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={tuition}
                    onChange={(e) => setTuition(e.target.checked)}
                    color="primary"
                  />
                }
                label="Tuition Available"
                style={{ color: "black" }}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="contained"
                  component="span"
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Upload Images
                </Button>
              </label>
              <List>
                {imageNames.map((name, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={name} />
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                        setImageNames(imageNames.filter((_, i) => i !== index));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: "black" }}>
                Rent Structure
              </Typography>
              {rentStructure.map((structure, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Students per Room"
                      type="number"
                      value={structure.studentsPerRoom}
                      onChange={(e) =>
                        handleRentStructureChange(
                          index,
                          "studentsPerRoom",
                          parseInt(e.target.value)
                        )
                      }
                      required
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ style: { color: "black" } }}
                      InputProps={{
                        style: { color: "black", backgroundColor: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      label="Rent per Student"
                      type="number"
                      value={structure.rentPerStudent}
                      onChange={(e) =>
                        handleRentStructureChange(
                          index,
                          "rentPerStudent",
                          parseInt(e.target.value)
                        )
                      }
                      required
                      variant="outlined"
                      margin="normal"
                      InputLabelProps={{ style: { color: "black" } }}
                      InputProps={{
                        style: { color: "black", backgroundColor: "white" },
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveRentStructure(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddRentStructure}
              >
                Add Rent Structure
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Hostel"}
          </Button>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
};
export default AddHostel;
