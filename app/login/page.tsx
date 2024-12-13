"use client";
import React, { useState } from "react";
import {
  FaFacebook,
  FaApple,
  FaGoogle,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { ChevronRight } from "lucide-react";
import Navbar from "../Component/mainpage/Navbar";
import Footer from "../Component/mainpage/Footer";
import { API_BASE_URL } from "@/config/api";

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (loginMethod === "email") {
        response = await axios.post(`${API_BASE_URL}/api/auth/student/login`, {
          email: email.toLowerCase(),
          password,
        });
      } else {
        // Implement phone login logic here
        console.log("Phone login not implemented yet");
        return;
      }

      const user = response.data;

      localStorage.setItem("email", email.toLowerCase());
      localStorage.setItem("role", user.userData.role);
      localStorage.setItem("token", user.token);
      localStorage.setItem("profileId", user.userData.profileId);

      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
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
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "An error occurred during login.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
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
      await axios.post(`${API_BASE_URL}/api/auth/student/reset-password`, {
        email: resetEmail.toLowerCase(),
      });
      setResetMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
      toast.info("Password reset link sent. Please check your email.");
    } catch (error) {
      setResetMessage("An error occurred. Please try again later.");
      toast.error("Failed to send reset link. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWith = (method: string) => {
    const baseUrl = `${API_BASE_URL}`;
    window.location.href = `${baseUrl}/api/auth/student/${method}`;
  };

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <ToastContainer autoClose={5000} hideProgressBar={false} />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-4xl relative z-1050 flex flex-col md:flex-row"
        >
          {/* Left side with logo and quote */}
          <div className="w-full md:w-2/5 bg-indigo-600 p-4 md:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="mb-4 md:mb-8 flex justify-center">
                <Image
                  src="/logo/logowhite.svg"
                  alt="Latur Hostel Logo"
                  width={150}
                  height={150}
                  className="w-32 h-32 md:w-auto md:h-auto"
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center">
                Latur Hostel
              </h1>
              <p className="text-base md:text-lg italic text-center">
                "Every hostel has a story and you will become a part of its
                novel with every night's stay"
              </p>
              <br />
              <p className="text-xs md:text-sm text-center mt-4 md:mt-0">
                Find your Home, away from Home
              </p>
            </div>
          </div>

          {/* Right side with login form */}
          <div className="w-full md:w-3/5 p-4 md:p-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-[28px] md:text-2[28px] font-semibold text-gray-800">
                Login to Stay Home
              </h2>
            </div>

            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 text-sm md:text-base ${
                  loginMethod === "email"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setLoginMethod("email")}
              >
                Email
              </button>
              <button
                className={`flex-1 py-2 text-sm md:text-base ${
                  loginMethod === "phone"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
                onClick={() => setLoginMethod("phone")}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {loginMethod === "email" ? (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      className="mr-2"
                    />
                    Signing In...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <div className="mt-4 md:mt-6 space-y-4">
              <div className="text-center">
                <button
                  onClick={handleForgotPassword}
                  className="text-xs md:text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Don't have an account?{" "}
                    <a
                      href="/register"
                      className="text-blue-400 hover:text-gray-800 transition-colors duration-200"
                    >
                      register
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="px-3 text-xs md:text-sm text-gray-500">
                or continue with
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mt-4 md:mt-6 space-y-3">
              {[
                {
                  icon: FaGoogle,
                  text: "Continue with Google",
                  method: "google",
                  styles:
                    "border border-gray-300 text-gray-500 bg-white hover:bg-gray-50",
                  iconColor: "#4285F4",
                },
                {
                  icon: FaFacebookF,
                  text: "Continue with Facebook",
                  method: "facebook",
                  styles: "bg-[#1877F2] text-white hover:bg-[#166FE5]",
                  iconColor: "white",
                },
                {
                  icon: FaInstagram,
                  text: "Continue with Instagram",
                  method: "instagram",
                  styles:
                    "bg-gradient-to-r from-[#405DE6] via-[#5851DB] via-[#833AB4] via-[#C13584] via-[#E1306C] via-[#FD1D1D] to-[#F56040] text-white hover:opacity-90",
                  iconColor: "white",
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleContinueWith(item.method)}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${item.styles}`}
                >
                  <item.icon
                    className="w-5 h-5 mr-2"
                    style={{ color: item.iconColor }}
                  />
                  {item.text}
                </button>
              ))}
            </div>

            <p className="mt-4 md:mt-6 text-xs text-center text-gray-500">
              By signing in you agree to our Privacy Policy and Terms &
              Conditions
            </p>
          </div>
        </motion.div>

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
              <p className="mt-2 text-sm text-blue-600">{resetMessage}</p>
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
      <Footer />
    </>
  );
};
export default Login;
