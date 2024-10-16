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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const MemoizedMenuIcon = React.memo(MenuIcon);
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
    return () => {
      document.head.removeChild(link);
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

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Amenities", path: "/amenities" },
    { text: "About Us", path: "/about" },
    { text: "Gallery", path: "/gallery" },
  ];

  return (
    <AppBar position="sticky" className="bg-white">
      <Toolbar className="justify-between items-center px-4 py-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Image
            src="/Images/NewLogo1.png"
            alt="Hostel Logo"
            width={isMobile ? 50 : 60}
            height={isMobile ? 50 : 60}
            className="mr-2"
          />
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
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="ml-4"
          >
            <IconButton
              color="primary"
              onClick={isMobile ? handleMobileMenuToggle : handleAuthModalOpen}
              className="bg-sky-100 hover:bg-sky-200 transition-colors duration-300"
            >
              {isMobile ? <MemoizedMenuIcon /> : <AccountCircleIcon />}
            </IconButton>
          </motion.div>
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
          {[
            ...navItems,
            { text: "Sign In", path: "/login" },
            { text: "Sign Up", path: "/register" },
          ].map((item, index) => (
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
