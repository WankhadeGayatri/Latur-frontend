"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Modal,
  Button,
  Fade,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"), {
  ssr: false,
});
const MemoizedMenuIcon = React.memo(MenuIcon);
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";

interface CustomButtonProps {
  onClick: () => void;
  isMobile: boolean;
  className?: string;
  ariaLabel: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  isMobile,
  className = "",
  ariaLabel,
}) => {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
        className={`inline-flex items-center justify-center p-1 rounded-full cursor-pointer ${className}`}
        aria-label={ariaLabel}
      >
        <MemoizedMenuIcon />
      </div>
    </motion.div>
  );
};

const Navbar: React.FC = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    link.rel = "stylesheet";
    link.setAttribute("media", "print");
    link.onload = () => {
      link.media = "all";
    };
    document.head.appendChild(link);

    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 1000);

    return () => {
      document.head.removeChild(link);
      clearInterval(blinkInterval);
    };
  }, []);
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState);
  }, []);
  const handleMobileMenuClose = () => setMobileMenuOpen(false);
  const handleAuthModalOpen = () => setAuthModalOpen(true);
  const handleAuthModalClose = () => setAuthModalOpen(false);

  const handleAuthAction = (action: "signin" | "signup") => {
    handleAuthModalClose();
    router.push(action === "signin" ? "/login" : "/register");
  };
  const handleLogoClick = useCallback(() => {
    router.push("/");
  }, [router]);

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Amenities", path: "/" },
    { text: "About Us", path: "/" },
    { text: "Gallery", path: "/" },
    { text: "Sign In", path: "/login" },
    { text: "Sign Up", path: "/register" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
      }}
      className="bg-white"
    >
      <Toolbar className="justify-between items-center px-4 py-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <Typography
            variant="h6"
            component="div"
            className="text-sky-600 font-semibold hidden sm:block"
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Latur Hostel
          </Typography>
        </motion.div>
        <Box className="flex items-center">
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ffe5e5",
                    padding: "10px 16px",
                    borderRadius: "24px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    marginRight: "16px",
                    "&:hover": {
                      backgroundColor: "#ffd6d6",
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                  onClick={() => router.push("/hostelownerlogin")}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#d32f2f",
                      fontWeight: "bold",
                      marginRight: "12px",
                      fontSize: "0.700rem",
                      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    }}
                  >
                    Are you hostel owner?
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <motion.div
                      animate={{
                        opacity: isBlinking ? 1 : 0.5,
                        scale: isBlinking ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Hand size={20} color="#d32f2f" />
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.text}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Typography
                    onClick={() => router.push(item.path)}
                    className="text-sky-700 hover:text-sky-500 cursor-pointer transition-colors duration-300"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {item.text}
                  </Typography>
                </motion.div>
              ))}
            </motion.div>
          )}

          {isMobile ? (
            <CustomButton
              onClick={isMobile ? handleMobileMenuToggle : handleAuthModalOpen}
              isMobile={isMobile}
              className="bg-sky-500 hover:bg-sky-600 transition-colors duration-300"
              ariaLabel={
                isMobile ? "Toggle mobile menu" : "Open authentication modal"
              }
            />
          ) : (
            ""
          )}
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          "& .MuiDrawer-paper": { width: "250px", bgcolor: "rgb(240 249 255)" },
        }}
      >
        <List>
          {navItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                router.push(item.path);
                handleMobileMenuClose();
              }}
              className="hover:bg-sky-200 transition-colors duration-300"
            >
              <ListItemText
                primary={item.text}
                className="text-sky-700"
                primaryTypographyProps={{
                  sx: { fontFamily: "'Poppins', sans-serif" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Modal
        open={authModalOpen}
        onClose={handleAuthModalClose}
        closeAfterTransition
      >
        <Fade in={authModalOpen}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white shadow-lg rounded-lg p-6">
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              className="text-sky-700 mb-4"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Sign In or Sign Up
            </Typography>
            <Box className="flex flex-col space-y-3">
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleAuthAction("signin")}
                className="bg-sky-500 hover:bg-sky-600 transition-colors duration-300"
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleAuthAction("signup")}
                className="border-sky-500 text-sky-500 hover:bg-sky-50 transition-colors duration-300"
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </AppBar>
  );
});

export default Navbar;
