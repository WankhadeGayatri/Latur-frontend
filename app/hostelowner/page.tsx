"use client";
import React, { useState } from "react";
import { Box, Paper, Container, useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PrimeFeatures from "./component/PrimeFeatures";
import SignupForm from "./component/SignupForm";
import SignInForm from "./component/SignInForm";
import Image from "next/image";
import Navbar from "../Component/mainpage/Navbar";
import Footer from "../Component/mainpage/Footer";
import GlassFeatureCards from "./component/GlassFeatureCards";

interface AuthPageProps {
  // Add any props if needed
}

const HostelOwnerAuth: React.FC<AuthPageProps> = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSignIn = async (data: any) => {
    try {
      // Implement your sign in logic here
      console.log("Sign in:", data);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const handleSignUp = async (data: any) => {
    try {
      // Implement your sign up logic here
      console.log("Sign up:", data);
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const handleGoogleAuth = async () => {
    try {
      // Implement Google authentication
      console.log("Google auth initiated");
    } catch (error) {
      console.error("Google auth error:", error);
      throw error;
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password logic
    console.log("Forgot password clicked");
  };

  return (
    <>
      <Navbar />
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          background: 'url("/Images/HomePage/spacious.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 0 },
            pb: { xs: 4, md: 0 },
          }}
        >
          {/* Left Side - PrimeFeatures */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              order: { xs: 1, md: 1 },
              p: 0,
            }}
          >
            <PrimeFeatures />
          </Box>

          {/* Right Side - Auth Forms */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 2, sm: 4 },
              order: { xs: 2, md: 2 },
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signup" : "signin"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                }}
              >
                {isSignUp ? (
                  <SignupForm
                    onSubmit={handleSignUp}
                    onGoogleSignup={handleGoogleAuth}
                    switchToLogin={() => setIsSignUp(false)}
                  />
                ) : (
                  <SignInForm
                    onSubmit={handleSignIn}
                    onGoogleSignIn={handleGoogleAuth}
                    onForgotPassword={handleForgotPassword}
                    switchToSignUp={() => setIsSignUp(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default HostelOwnerAuth;
