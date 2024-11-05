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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
const CloseIcon = dynamic(() => import("@mui/icons-material/Close"), {
  ssr: false,
});
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";

// Make MenuIconSvg client-only to prevent hydration mismatch
const MenuIconSvg = dynamic(
  () =>
    Promise.resolve(() => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width="24"
        height="24"
        className="w-6 h-6"
      >
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    )),
  {
    ssr: false,
    loading: () => (
      <div className="w-6 h-6" /> // Placeholder while loading
    ),
  }
);

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
        <MenuIconSvg />
      </div>
    </motion.div>
  );
};

const Navbar: React.FC = React.memo(() => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(true);
  const isMobile = useMediaQuery("(max-width: 640px)", {
    noSsr: true,
    defaultMatches: false,
  });
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prevState) => !prevState);
  }, []);

  const handleMobileMenuClose = () => setMobileMenuOpen(false);

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

  // Don't render until after mounting to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

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
              {navItems.map((item) => (
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
              onClick={handleMobileMenuToggle}
              isMobile={isMobile}
              className="bg-sky-500 hover:bg-sky-600 transition-colors duration-300"
              ariaLabel="Toggle mobile menu"
            />
          ) : null}
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={handleMobileMenuClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffe5e5",
                padding: "10px 16px",
                borderRadius: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                marginBottom: "16px",
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
          </ListItem>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                router.push(item.path);
                handleMobileMenuClose();
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
});

export default Navbar;
