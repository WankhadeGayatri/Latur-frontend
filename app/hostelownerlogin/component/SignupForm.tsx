// SignupForm.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Lock, Phone, MapPin, Building, Home } from "lucide-react";
import axios from "axios";
import {
  Checkbox,
  Modal,
  Tooltip,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import GoogleIcon from "@mui/icons-material/Google";
import { API_BASE_URL } from "@/config/api";
import { useRouter } from "next/navigation";
// Define the form schema
const signupFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface SignupFormProps {
  onSubmit: (data: SignupFormValues) => Promise<void>;
  onGoogleSignup?: () => Promise<void>;
  switchToLogin: () => void;
}
interface Role {
  _id: string;
  name: string;
}

type RoleName = "student" | "hostelOwner";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleName: string;
  phoneNumber: string;
  parentnumber: string;
  classYear?: string;
  schoolCollegeName?: string;
  city: string;
  address?: string;
  passportPhoto?: File | null;
  idProof?: File | null;
}
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});
const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  onGoogleSignup,
  switchToLogin,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleName: "hostelOwner",
    phoneNumber: "",
    parentnumber: "",

    city: "",
    address: "",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  //const [showOAuthRoleModal, setShowOAuthRoleModal] = useState<boolean>(false);
  const [oauthSelectedRole, setOauthSelectedRole] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [studentRoleId, setStudentRoleId] = useState<string>("");
  const router = useRouter();
  const [hostelOwnerRoleId, setHostelOwnerRoleId] = useState<string>("");
  const studentTerms = {
    terms: [
      "Maintain clean, well-kept, and safe facilities for all guests",
      "Provide amenities like high-speed internet, common areas, and security",
      "Adhere to all local zoning, safety, and health regulations",
      "Employ a professional and courteous staff to assist guests",
      "Respond promptly to any guest inquiries or concerns",
    ],
    benefits: [
      "Increased visibility and discoverability",
      "Access to a large guest pool",
      "Streamlined booking and payment processing",
      "Analytical tools and performance monitoring",
      "Promotional opportunities and partnerships",
      "24/7 support from the hospitality team",
    ],
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setTermsAccepted(!termsAccepted);
    setModalOpen(false);
  };

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const getCurrentRoleName = (): RoleName => {
    const currentRole = roles.find((role) => role._id === formData.roleName);
    return (currentRole?.name as RoleName) || "student";
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Existing validations
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    setemail(formData.email);
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Phone number is required";

    // Enhanced password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          "Password must be at least 8 characters long, contain one uppercase letter and one special character";
      }
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Student specific validation
    const currentRoleName = getCurrentRoleName();
    if (currentRoleName === "student") {
      if (!formData.parentnumber) {
        newErrors.parentnumber = "Parent Phone number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [registeredEmail, setRegisteredEmail] = useState<string>(""); // Add this state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showOtpInput) {
      await handleOtpSubmit();
    } else {
      if (!validateForm()) return;

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      try {
        const response = await api.post(
          "/api/auth/owner/register",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Store email in localStorage or state
        localStorage.setItem("registrationEmail", formData.email);
        setUserId(response.data.userId);
        setShowOtpInput(true);
      } catch (error: any) {
        console.error("Registration error:", error);
        setErrors({
          email:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      }
    }
  };

  const handleOtpSubmit = async () => {
    try {
      // Get email from localStorage
      const registrationEmail = localStorage.getItem("registrationEmail");

      const response = await api.post(
        "/api/auth/owner/verify-registration-otp",
        {
          email: registrationEmail,
          otp,
        }
      );

      // Clear stored email after successful verification
      localStorage.removeItem("registrationEmail");

      alert("Registration completed successfully!");
      switchToLogin();
      router.push("/hostelowner");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      setErrors({});
    }
  };

  const handleOAuthRoleSelect = () => {
    handleOAuthLogin("google");
  };

  const handleOAuthLogin = (provider: string) => {
    const baseUrl = `${API_BASE_URL}`;

    window.location.href = `${baseUrl}/api/auth/owner/${provider}`;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ["/Images/HomePage/AI.jpg", "/Images/HomePage/AI2.jpg"];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="min-h-screen rounded-2xl shadow-2xl  flex flex-col py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {" "}
        {/* Background decorative elements */}
        <div className=" sm:mx-auto sm:w-full sm:max-w-7xl z-10">
          <div className="   overflow-hidden flex flex-col lg:flex-row items-stretch  bg-white">
            <div className="px-4 py-8 sm:p-6 flex-grow">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Hostel Owner Register
                </h2>
                <p className="mt-1 text-gray-600">
                  Welcome back! Access your property dashboard
                </p>
              </div>
              <div>
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-3">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="you@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className=" block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="+9125456687"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Confirm Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Already have an account?{" "}
                      <a
                        onClick={switchToLogin}
                        className="cursor-pointer text-sky-500 hover:text-sky-600 no-underline"
                      >
                        Login
                      </a>
                    </Typography>
                    {showOtpInput && (
                      <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        OTP sent successfully. Please check your email.
                      </div>
                    )}
                    {showOtpInput ? (
                      <div className="mt-6">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Enter OTP
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="text"
                            id="otp"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                            placeholder="Enter the 6-digit OTP"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please click and read the terms and conditions."
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                onClick={() => handleOAuthRoleSelect()}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Google
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                  />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>

                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please click and read the terms and conditions"
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#1877F2] hover:bg-[#166FE5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2] transition duration-150 ease-in-out ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Facebook
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>

                          <div>
                            <Tooltip
                              title={
                                !termsAccepted
                                  ? "Please click and read the terms and conditions."
                                  : ""
                              }
                            >
                              <button
                                type="button"
                                className={`w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#405DE6] via-[#5851DB] via-[#833AB4] via-[#C13584] via-[#E1306C] via-[#FD1D1D] to-[#F56040] hover:from-[#365BCE] hover:via-[#4A47C3] hover:via-[#76339F] hover:via-[#AD307A] hover:via-[#CA2B61] hover:via-[#E51A1A] hover:to-[#DC5639] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E1306C] transition duration-150 ease-in-out ${
                                  !termsAccepted &&
                                  "opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!termsAccepted}
                              >
                                <span className="sr-only">
                                  Sign in with Instagram
                                </span>
                                <svg
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Read the{" "}
                        <a
                          href="#"
                          onClick={handleOpenModal}
                          className="text-blue-600 hover:underline"
                        >
                          terms and conditions
                        </a>
                      </label>
                    </div>

                    <div className="mt-6">
                      <>
                        <Tooltip
                          title={
                            !termsAccepted
                              ? "Please click and read the terms and conditions."
                              : ""
                          }
                        >
                          <button
                            type="submit"
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                              !termsAccepted && "opacity-50 cursor-not-allowed"
                            }`}
                            disabled={!termsAccepted}
                          >
                            {showOtpInput ? "Verify OTP" : "Register"}
                          </button>
                        </Tooltip>
                      </>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-terms-title"
        aria-describedby="modal-terms-description"
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
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Typography id="modal-terms-title" variant="h6" component="h2">
            HostelOwners Terms, Conditions, and Benefits
          </Typography>
          <Typography id="modal-terms-description" sx={{ mt: 2 }}>
            <h3 className="font-bold mb-2">Terms:</h3>
            <ul className="list-disc pl-5 mb-4">
              {studentTerms.terms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
            <h3 className="font-bold mb-2">Benefits:</h3>
            <ul className="list-disc pl-5">
              {studentTerms.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default SignupForm;
