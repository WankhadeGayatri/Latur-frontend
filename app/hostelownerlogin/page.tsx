"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { motion, MotionValue } from "framer-motion";
import {
  LogIn,
  Link,
  MessageCircle,
  X,
  Bell,
  Star,
  Zap,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

import Image from "next/image";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Email,
  Facebook,
  Google,
  Instagram,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import Navbar from "../Component/mainpage/Navbar";
import router from "next/router";
import Footer from "../Component/mainpage/Footer";
// import { API_BASE_URL } from "../config/api";
interface PlanCardProps {
  title: string;
  features: string[];
  buttonText: string;
  isPrime?: boolean;
}
type FormErrors = {
  gender: any;
  name?: string;
  roleName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  number?: string;
};
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  features,
  buttonText,
  isPrime = false,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`w-full p-6 bg-white rounded-lg shadow-lg ${
      isPrime ? "border-2 border-indigo-500" : ""
    } mb-6`}
  >
    <h3
      className={`text-2xl font-semibold mb-4 ${
        isPrime ? "text-indigo-700" : "text-gray-800"
      }`}
    >
      {title}
    </h3>
    <ul className="space-y-2 mb-4">
      {features.map((item, index) => (
        <motion.li
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center text-gray-600"
        >
          <svg
            className={`w-5 h-5 mr-2 ${
              isPrime ? "text-indigo-500" : "text-green-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          {item}
        </motion.li>
      ))}
    </ul>
    <div className="flex justify-end">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`ml-auto px-4 py-1 rounded-lg font-semibold transition duration-300 ${
          isPrime
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {buttonText}
      </motion.button>
    </div>
  </motion.div>
);
const HostelOwnerPromo: React.FC = () => (
  <div className="p-4 bg-gray-100  flex flex-col justify-center">
    <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700  ">
      "Hostels' Ultimate Online Management Solution"
    </h2>
    <div className="flex flex-col space-y-6  mt-16">
      <PlanCard
        title="Free Plan"
        features={[
          "Basic booking management",
          "Limited guest profiles",
          "Limited guest profiles",
        ]}
        buttonText="Start Free Trial"
      />
      <PlanCard
        title="Prime Plan"
        features={[
          "24/7 priority support",
          "Customizable dashboard",
          "Integration with external services",
        ]}
        buttonText="Upgrade to Prime"
        isPrime={true}
      />
    </div>
  </div>
);

const BotMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <MessageCircle className="h-10 w-10 text-indigo-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Hey owner!</p>
              <p className="text-sm text-gray-600 mt-1">
                Hurry up and list your hostel on our website! Join our family of
                successful hostel owners today.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-600 transition duration-300"
              >
                List My Hostel Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PrimeFeatures = () => {
  const features = [
    {
      icon: Star,
      title: "Premium Listing",
      description: "Get top visibility with our premium listing option",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description:
        "Enable guests to book instantly, increasing your occupancy rate",
    },
    {
      icon: TrendingUp,
      title: "Dynamic Pricing",
      description: "Optimize your pricing based on demand and seasonality",
    },
  ];

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="h-full w-full flex flex-col items-start px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl w-full">
        <h1 className="text-6xl font-extrabold text-white mb-8">
          Prime Features
        </h1>
        <div className="flex flex-wrap justify-start gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg overflow-hidden shadow-xl rounded-lg transform hover:scale-105 transition duration-300 h-48 w-72"
            >
              <div className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-center mb-4">
                  <i
                    className={`text-4xl text-indigo-300 ? 'fas fa-bolt' : 'fas fa-chart-line'}`}
                  ></i>
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-300 text-center">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HostelOwnerAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [hostelOwnerRoleId, setHostelOwnerRoleId] = useState<string>("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    axios
      .get<{ _id: string; name: string }[]>(
        `${API_BASE_URL}/api/admin/getroles`
      )
      .then((response) => {
        const hostelOwnerRole = response.data.find(
          (role) => role.name === "hostelOwner"
        );
        if (hostelOwnerRole) {
          setHostelOwnerRoleId(hostelOwnerRole._id);
        }
      })
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleOAuthLogin = (provider: string) => {
    const baseUrl = `${API_BASE_URL}`;

    window.location.href = `${baseUrl}/api/auth/owner/${provider}`;
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat mt-0"
      style={{
        backgroundImage: "url('/Images/HomePage/spacious.jpg')",
      }}
    >
      <Navbar />
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start w-full">
          <div className="w-full md:w-1/2 max-w-5xl col-12 col-md-6 col-lg-5 p-4 p-lg-5 p-6 md:p-12 flex flex-col ">
            <PrimeFeatures />
          </div>

          <div
            id="signup-section"
            className={`flex-grow flex col-12 col-md-6 col-lg-5 d-flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 mt-8 mr-20 mb-0 ${
              isMobile ? "ml-4" : ""
            }`}
          >
            <div className="m-auto rounded-xl shadow-2xl overflow-hidden mr-20 w-full max-w-5xl flex flex-col md:flex-row">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isSignUp ? "signup" : "login"}
                  initial={{ opacity: 0, x: isSignUp ? 300 : -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -300 : 300 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="w-full md:w-1/2 p-6 md:p-8 bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center"
                >
                  <div
                    className={`w-full ${
                      isMobile ? "max-w-[95vw] px-4" : "max-w-2xl"
                    }`}
                  >
                    {isSignUp ? (
                      <motion.div
                        key="signup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SignupForm
                          toggleForm={toggleForm}
                          handleOAuthLogin={handleOAuthLogin}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <EnhancedLoginForm
                          toggleForm={toggleForm}
                          handleOAuthLogin={handleOAuthLogin}
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="hidden md:flex w-full md:w-1/2 bg-gray-100 p-6 md:p-8 flex-col justify-center">
                <HostelOwnerPromo />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <div className="fixed bottom-4 right-4">
        <a href="#" aria-label="WhatsApp">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-green-500 p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </motion.div>
        </a>
      </div>
      <BotMessage />
      {/* <NotificationSystem /> */}
    </div>
  );
};
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});
const SignupForm: React.FC<{
  toggleForm: () => void;
  handleOAuthLogin: (provider: string) => void;
}> = ({ toggleForm, handleOAuthLogin }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roleName: "hostelOwner",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    number: "",
    idProof: null as File | null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validateField = (name: string, value: string | File | null): string => {
    switch (name) {
      case "name":
        return value && /^[A-Za-z ]+$/.test(value as string)
          ? ""
          : "Only letters and spaces allowed";
      case "email":
        return value &&
          /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value as string)
          ? ""
          : "Invalid email format";
      case "password":
        return (value as string).length >= 8
          ? ""
          : "Password must be at least 8 characters long";
      case "number":
        return /^[0-9]{10}$/.test(value as string)
          ? ""
          : "Phone number must be 10 digits";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const newValue = name === "idProof" && files ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    const error = validateField(name, newValue);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!termsAccepted) {
      alert("Please accept the terms and conditions before proceeding.");
      return;
    }
    setIsLoading(true);

    try {
      if (!otpSent) {
        const response = await api.post("/api/auth/owner/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        localStorage.setItem("registrationEmail", formData.email);
        console.log("Signup response:", response.data);
        setOtpSent(true);
      } else {
        const registrationEmail = localStorage.getItem("registrationEmail");
        const verifyResponse = await api.post(
          "/api/auth/owner/verify-registration-otp",
          {
            email: registrationEmail,
            otp,
          }
        );
        console.log("OTP verification response:", verifyResponse.data);
        if (
          verifyResponse.data.message === "Registration completed successfully"
        ) {
          router.push("/hostelownerlogin");
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTermsModal = () => setTermsModalOpen(true);
  const handleCloseTermsModal = () => setTermsModalOpen(false);
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setTermsModalOpen(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        // maxWidth: isMobile ? '100%' : '400px',
        margin: "auto",
        padding: isMobile ? "16px" : "24px",
        backgroundColor: "white",
        borderRadius: isMobile ? "0" : "8px",
        boxShadow: isMobile ? "none" : 3,
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        Create Hostel Owner Account
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="name"
            label="Name"
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!formErrors.password}
            helperText={formErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            name="number"
            label="Phone Number"
            value={formData.number}
            onChange={handleChange}
            error={!!formErrors.number}
            helperText={formErrors.number}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {otpSent && (
        <TextField
          fullWidth
          name="otp"
          label="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          margin="normal"
        />
      )}

      <Box sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I accept the{" "}
              <Button
                onClick={handleOpenTermsModal}
                color="primary"
                sx={{
                  padding: 0,
                  textTransform: "none",
                  verticalAlign: "baseline",
                }}
              >
                terms and conditions
              </Button>
            </Typography>
          }
        />
      </Box>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {isLoading ? (
          <CircularProgress size={24} />
        ) : otpSent ? (
          "Verify OTP"
        ) : (
          "Sign Up"
        )}
      </Button>

      <Typography variant="body2" align="center">
        Already have an account?{" "}
        <Button color="primary" onClick={toggleForm}>
          Sign in
        </Button>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" align="center">
            Or continue with
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Tooltip
              title={
                !termsAccepted ? "Please accept the terms and conditions." : ""
              }
            >
              <span>
                <IconButton
                  onClick={() => handleOAuthLogin("google")}
                  disabled={!termsAccepted}
                  sx={{ color: "#DB4437" }}
                >
                  <Google />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip
              title={
                !termsAccepted ? "Please accept the terms and conditions." : ""
              }
            >
              <span>
                <IconButton
                  onClick={() => handleOAuthLogin("facebook")}
                  disabled={!termsAccepted}
                  sx={{ color: "#4267B2", mx: 1 }}
                >
                  <Facebook />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                !termsAccepted ? "Please accept the terms and conditions." : ""
              }
            >
              <span>
                <IconButton
                  onClick={() => handleOAuthLogin("instagram")}
                  disabled={!termsAccepted}
                  sx={{ color: "#E1306C", mx: 1 }}
                >
                  <Instagram />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Typography>

      <Modal
        open={termsModalOpen}
        onClose={handleCloseTermsModal}
        aria-labelledby="terms-modal-title"
        aria-describedby="terms-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="terms-modal-title" variant="h6" component="h2">
            Terms and Conditions
          </Typography>
          <Typography id="terms-modal-description" sx={{ mt: 2 }}>
            {/* Add your terms and conditions text here */}
            By accepting these terms, you agree to our privacy policy and usage
            guidelines.
          </Typography>
          <Button onClick={handleAcceptTerms} sx={{ mt: 2 }}>
            Accept Terms
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

const EnhancedLoginForm: React.FC<{
  toggleForm: () => void;
  handleOAuthLogin: (provider: string) => void;
}> = ({ toggleForm, handleOAuthLogin }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/owner/login`,
        {
          ...formData,
          email: formData.email.toLowerCase(),
        }
      );

      const user = response.data;
      console.log("userrr", user);
      localStorage.setItem("email", formData.email.toLowerCase());
      localStorage.setItem("role", user.userData.role);
      localStorage.setItem("token", user.token);
      localStorage.setItem("profileId", user.userData.profileId);

      switch (user.userData.role) {
        case "student":
          router.push("/Dashboard/student");
          break;
        case "hostelOwner":
          router.push("/Dashboard/hostalOwner");
          break;
        case "admin":
          router.push("/Dashboard/admin");
          break;
        default:
          router.push("/customizeDashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message || "An error occurred during login."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const handleForgotPassword = () => setOpenForgotPassword(true);
  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
    setResetEmail("");
    setResetMessage("");
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    setResetMessage("");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/student/reset-password",
        {
          email: resetEmail.toLowerCase(),
        }
      );
      setResetMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      setResetMessage("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md"
        sx={{
          width: "100%",
          maxWidth: isMobile ? "90vw" : "400px",
          margin: "auto",
          padding: isMobile ? 2 : 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          className="text-gray-800 text-center mb-6 font-bold"
        >
          Sign In
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          className="mb-4"
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4"
        />
        {error && (
          <Typography
            color="error"
            variant="body2"
            className="mt-2 text-center"
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="mt-6 mb-4 bg-blue-600 hover:bg-blue-700 transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <CircularProgress size={24} color="inherit" className="mr-2" />
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={toggleForm}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </button>
        </p>
        <Typography variant="body2" className="text-center mt-2">
          <Link
            onClick={handleForgotPassword}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Forgot Password?
          </Link>
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Or sign in with
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton
              onClick={() => handleOAuthLogin("google")}
              sx={{ color: "#DB4437" }}
            >
              <Google />
            </IconButton>

            <Tooltip
              title={
                !setTermsAccepted
                  ? "Please accept the terms and conditions."
                  : ""
              }
            >
              <span>
                <IconButton
                  onClick={() => handleOAuthLogin("facebook")}
                  disabled={!setTermsAccepted}
                  sx={{ color: "#4267B2", mx: 1 }}
                >
                  <Facebook />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                !setTermsAccepted
                  ? "Please accept the terms and conditions."
                  : ""
              }
            >
              <span>
                <IconButton
                  onClick={() => handleOAuthLogin("instagram")}
                  disabled={!setTermsAccepted}
                  sx={{ color: "#E1306C", mx: 1 }}
                >
                  <Instagram />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Dialog open={openForgotPassword} onClose={handleCloseForgotPassword}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="resetEmail"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          {resetMessage && (
            <Typography color="primary" variant="body2" className="mt-2">
              {resetMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>Cancel</Button>
          <Button onClick={handleResetPassword} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HostelOwnerAuth;

function setTermsAccepted(_arg0: boolean) {
  throw new Error("Function not implemented.");
}
