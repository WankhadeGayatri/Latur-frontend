"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
  MenuItem,
} from "@mui/material";
import { PhotoCamera, Save as SaveIcon } from "@mui/icons-material";
import axios, { AxiosError } from "axios";
import ProfileNotifications from "./ProfileNotifications";
import { useNotification } from "./NotificationProvider";
import { API_BASE_URL } from "@/config/api";

interface ProfileData {
  [key: string]: string | undefined;
  name: string;
  number: string;
  email: string;
  class: string;
  year: string;
  school: string;
  college: string;
  city: string;
  address: string;
  gender?: string;
  password: string;
  passportPhoto?: string;
}

const UserProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    number: "",
    email: "",
    class: "",
    year: "",
    school: "",
    college: "",
    city: "",
    address: "",
    password: "",
    parentname: "",
    parentnumber: "",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showEmailOTPField, setShowEmailOTPField] = useState(false);
  const [emailOTP, setEmailOTP] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailUpdated, setEmailUpdated] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordSet, setPasswordSet] = useState(false);
  const { updateNotificationCount } = useNotification();
  const requiredFields = [
    "name",
    "number",
    "email",
    "class",
    "year",
    "school",
    "city",
    "address",
    "gender",
  ];
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login first ");
      }
      const config = {
        headers: { Authorization: `Bearer ${token} ` },
      };

      const response = await axios.get<ProfileData>(
        `${API_BASE_URL}/api/students/${profileId}`,
        config
      );
      console.log("response", response.data);

      setProfileData(response.data);
      setPasswordSet(!!response.data.password);

      setProfileData((prevData) => ({
        ...prevData,
        email: response.data.email || localStorage.getItem("email") || "",
      }));

      if (response.data.passportPhoto) {
        const photoResponse = await axios.get<Blob>(
          `${API_BASE_URL}/api/students/getphoto/${profileId}`,
          {
            responseType: "blob",
            ...config,
          }
        );
        setPreviewImage(URL.createObjectURL(photoResponse.data));
      }
      const missingFields = requiredFields.filter(
        (field) => !profileData[field]
      );
      updateNotificationCount(missingFields.length);

      setError("Profile updated successfully!");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(`Failed to load user data`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string);
        }
      });
      if (profileImage) {
        formData.append("passportPhoto", profileImage);
      }
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login first.");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.put(
        `${API_BASE_URL}/api/students/update-profile/${profileId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...config.headers,
          },
        }
      );

      console.log("email", profileData.email);
      localStorage.setItem("email", profileData.email.toLowerCase());
      console.log("Profile updated successfully:", response.data);
      setError("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email: profileData.email },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowOTPField(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTPAndChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "${API_BASE_URL}/api/auth/resetownpasswaord",
        {
          email: profileData.email,
          otp,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Response:", response.data);
      setShowOTPField(false);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setError("Password changed successfully");
    } catch (error) {
      console.error("Error verifying OTP and changing password:", error);
      setError(
        (error as AxiosError<{ message?: string }>).response?.data?.message ||
          "Failed to change password. Please check your OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailOTP = async () => {
    if (!newEmail) {
      setError("Please enter the new email address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const response = await axios.post(
        "${API_BASE_URL}/api/auth/send-email-otp",
        { profileId, newEmail },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setShowEmailOTPField(true);
        setError("OTP sent to your new email. Please check the inbox.");
      } else {
        setError(
          response.data.error || "Failed to send OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error requesting Email OTP:", error);
      setError(
        (error as AxiosError<{ message?: string }>).response?.data?.message ||
          "Failed to send Email OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOTP) {
      setError("Please enter the Email OTP");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const response = await axios.post(
        "${API_BASE_URL}/api/auth/verify-email-otp",
        {
          profileId,
          otp: emailOTP,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        localStorage.setItem("email", newEmail.toLowerCase());
        setEmailUpdated(true);
        setShowEmailOTPField(false);
        setEmailOTP("");
        setProfileData((prev) => ({ ...prev, email: newEmail }));
        setError("Email changed successfully!");
      } else {
        setError(
          response.data.error || "Failed to verify OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying Email OTP:", error);
      if (axios.isAxiosError(error)) {
        setError(
          (error as AxiosError<{ error?: string; details?: string }>).response
            ?.data?.error ||
            (error as AxiosError<{ error?: string; details?: string }>).response
              ?.data?.details ||
            "Failed to verify Email OTP. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordAction = () => {
    handleRequestOTP();

    setShowOTPField(true);
  };
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        fontWeight="bold"
        sx={{ color: "#1a1a1a", mb: 4 }}
      >
        User Profile
      </Typography>
      {!passwordSet && (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Action Required</AlertTitle>
          Please set your password to secure your account. Go Down and set
          password
          {/* <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={handlePasswordAction}
            sx={{ ml: 2 }}
          >
            Set Password Now
          </Button> */}
        </Alert>
      )}
      <ProfileNotifications profileData={profileData} />

      <Grid container spacing={4}>
        {/* Left side - Image */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#1a1a1a",
              height: "100%",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Avatar
              src={previewImage || undefined}
              sx={{
                marginTop: "50%",
                width: 200,
                height: 200,
                mb: 2,
                border: "3px solid cyan",
                boxShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
              }}
            >
              {profileData.name.charAt(0).toUpperCase()}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="icon-button-file"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="icon-button-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{
                  color: "cyan",
                  borderColor: "cyan",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(0, 255, 255, 0.1)",
                  },
                }}
              >
                Change Photo
              </Button>
            </label>
          </Box>
        </Grid>

        {/* Right side - Form */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #ffffff 0%, #87CEEB 100%)",
              p: 3,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="200px"
              >
                <CircularProgress sx={{ color: "#1a1a1a" }} />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {[
                  { name: "name", label: "Full Name" },
                  { name: "number", label: "Phone Number" },
                  { name: "parentname", label: "Parent Name" },
                  { name: "parentnumber", label: "Parent Phone Number" },
                  { name: "class", label: "Class" },
                  { name: "year", label: "Year" },
                  { name: "school", label: "School/College" },
                  { name: "city", label: "City" },
                  { name: "email", label: "Email" },
                  {
                    name: "address",
                    label: "Address",
                    multiline: true,
                    rows: 2,
                  },
                ].map((field) => (
                  <Grid item xs={12} sm={6} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={profileData[field.name]}
                      onChange={handleChange}
                      variant="outlined"
                      multiline={field.multiline}
                      rows={field.rows}
                      InputLabelProps={{
                        sx: { color: "rgba(0, 0, 0, 0.7)" },
                      }}
                      InputProps={{
                        sx: {
                          color: "#1a1a1a",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                        },
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    name="gender"
                    value={profileData.gender || ""}
                    onChange={handleChange}
                    variant="outlined"
                    InputLabelProps={{
                      sx: { color: "rgba(0, 0, 0, 0.7)" },
                    }}
                    InputProps={{
                      sx: {
                        color: "#1a1a1a",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1a1a1a",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1a1a1a",
                        },
                      },
                    }}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: "#1a1a1a", mb: 2 }}>
                Change Email
              </Typography>
              <TextField
                fullWidth
                label="New Email Address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{
                  sx: { color: "rgba(0, 0, 0, 0.7)" },
                }}
                InputProps={{
                  sx: {
                    color: "#1a1a1a",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1a1a1a",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1a1a1a",
                    },
                  },
                }}
              />
              {!showEmailOTPField ? (
                <Button
                  variant="outlined"
                  onClick={handleRequestEmailOTP}
                  sx={{
                    color: "#1a1a1a",
                    borderColor: "#1a1a1a",
                    "&:hover": {
                      borderColor: "#1a1a1a",
                      backgroundColor: "rgba(26, 26, 26, 0.1)",
                    },
                  }}
                >
                  Send OTP to New Email
                </Button>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Enter Email OTP"
                    value={emailOTP}
                    onChange={(e) => setEmailOTP(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      sx: { color: "rgba(0, 0, 0, 0.7)" },
                    }}
                    InputProps={{
                      sx: {
                        color: "#1a1a1a",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1a1a1a",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1a1a1a",
                        },
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleVerifyEmailOTP}
                    sx={{
                      bgcolor: "#1a1a1a",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(26, 26, 26, 0.8)" },
                    }}
                  >
                    Verify OTP and Change Email
                  </Button>
                </>
              )}

              {emailUpdated && (
                <Typography variant="body2" sx={{ color: "green", mt: 2 }}>
                  Email updated successfully!
                </Typography>
              )}
            </Box>

            {/* Change Password Section */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: "#1a1a1a", mb: 2 }}>
                {passwordSet ? "Change Password" : "Set Password"}
              </Typography>
              {!showOTPField ? (
                <Button
                  variant="outlined"
                  onClick={handlePasswordAction}
                  sx={{
                    color: "#1a1a1a",
                    borderColor: "#1a1a1a",
                    "&:hover": {
                      borderColor: "#1a1a1a",
                      backgroundColor: "rgba(26, 26, 26, 0.1)",
                    },
                  }}
                >
                  {passwordSet ? "Change Password" : "Set Password"}
                </Button>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      InputLabelProps={{
                        sx: { color: "rgba(0, 0, 0, 0.7)" },
                      }}
                      InputProps={{
                        sx: {
                          color: "#1a1a1a",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      InputLabelProps={{
                        sx: { color: "rgba(0, 0, 0, 0.7)" },
                      }}
                      InputProps={{
                        sx: {
                          color: "#1a1a1a",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      InputLabelProps={{
                        sx: { color: "rgba(0, 0, 0, 0.7)" },
                      }}
                      InputProps={{
                        sx: {
                          color: "#1a1a1a",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(0, 0, 0, 0.23)",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a1a1a",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleVerifyOTPAndChangePassword}
                      sx={{
                        bgcolor: "#1a1a1a",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(26, 26, 26, 0.8)" },
                      }}
                    >
                      {passwordSet ? "Change Password" : "Set Password"}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: "#1a1a1a",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(26, 26, 26, 0.8)" },
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserProfile;
