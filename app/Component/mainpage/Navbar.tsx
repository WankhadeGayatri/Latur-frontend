"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
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
  Stack,
  Menu,
} from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
const CloseIcon = dynamic(() => import("@mui/icons-material/Close"), {
  ssr: false,
});
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hand, Mail } from "lucide-react";

// EmailStrip Component
const EmailStrip = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(true);
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(blinkInterval);
    };
  }, []);

  const isHostelOwnerPage = pathname === "/hostelownerlogin";

  const getHostelOwnerButtonStyles = () => {
    if (isHostelOwnerPage) {
      return {
        backgroundColor: "#831843",
        "&:hover": {
          backgroundColor: "#9d174d",
          transform: "scale(1.05)",
          transition: "all 0.3s ease-in-out",
        },
      };
    }
    return {
      backgroundColor: "#ffe5e5",
      "&:hover": {
        backgroundColor: "#ffd6d6",
        transform: "scale(1.05)",
        transition: "all 0.3s ease-in-out",
      },
    };
  };

  const getHostelOwnerTextColor = () => {
    return isHostelOwnerPage ? "#ffffff" : "#d32f2f";
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #FFFFFF 0%, #f0f7ff 100%)",
        py: { xs: 2, sm: 1 },
        px: { xs: 2, sm: 3 },
        color: "#566573",
        fontFamily: "'Poppins', sans-serif",
        position: "relative",
        minHeight: { xs: "80px", sm: "auto" },
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          width: { xs: "100%", sm: "30%" },
          height: "100%",
          background: "#FFFFFF",
          zIndex: 0,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 2 }}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          {/* Placeholder for left side */}
          <Box
            sx={{
              width: { xs: "100%", sm: "auto" },
              order: { xs: 1, sm: 1 },
            }}
          />

          {/* Right side with email and other content */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems="center"
            sx={{
              flex: 1,
              gap: { xs: 1, sm: 2 },
              justifyContent: "flex-end",
              width: { xs: "100%", sm: "auto" },
              order: { xs: 2, sm: 2 },
            }}
          >
            {/* Email section - now on the right side */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: { xs: 2, sm: 3 },
                width: { xs: "100%", sm: "auto" },
                mb: { xs: 1, sm: 0 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1 },
                }}
              >
                <Mail size={16} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  contact@laturhostel.com
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1 },
                }}
              >
                <Mail size={16} />
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                  }}
                >
                  admin@laturhostel.com
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </motion.div>
    </Box>
  );
};

// Rest of your existing components remain the same
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
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>
    </motion.div>
  );
};

const NavigationContent: React.FC<{
  pathname: string;
  onNavigate: (path: string) => void;
  isMobile: boolean;
}> = ({ pathname, onNavigate, isMobile }) => {
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { text: "Home", path: "/" },
    { text: "About Us", path: "/aboutus" },
    { text: "Amenities", path: "/amenities" },
    { text: "Contact", path: "/contactus" },
    { text: "Gallery", path: "/gallery" },
    { text: "Sign-in", path: "/login" },
    { text: "Register", path: "/register" },
  ];

  return (
    <>
      {navItems.map((item) => (
        <motion.div
          key={item.text}
          className={`relative ${isMobile ? "w-full" : ""}`}
          whileHover={{ scale: isMobile ? 1.02 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box
            onClick={() => onNavigate(item.path)}
            className={`
              ${isMobile ? "px-3 py-2 my-0.5 rounded-lg w-full" : ""}
              ${isActive(item.path) ? "text-sky-700 font-semibold" : ""}
              transition-all duration-300 ease-in-out cursor-pointer
            `}
          >
            <Typography
              className={`
                ${isMobile ? "text-sm" : ""}
                ${
                  isActive(item.path)
                    ? "text-sky-700 font-semibold"
                    : "text-gray-600 hover:text-sky-600"
                }
                transition-colors duration-300
              `}
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {item.text}
            </Typography>
          </Box>
          {isActive(item.path) && !isMobile && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 "
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              layoutId="activeIndicator"
            />
          )}
        </motion.div>
      ))}
    </>
  );
};

// Main Navbar component
const Navbar: React.FC = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
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

  const handleNavigation = (path: string) => {
    router.push(path);
    handleMobileMenuClose();
  };

  const isHostelOwnerPage = pathname === "/hostelownerlogin";

  const getHostelOwnerButtonStyles = () => {
    if (isHostelOwnerPage) {
      return {
        backgroundColor: "#831843",
        "&:hover": {
          backgroundColor: "#9d174d",
          transform: "scale(1.05)",
          transition: "all 0.3s ease-in-out",
        },
      };
    }
    return {
      backgroundColor: "#ffe5e5",
      "&:hover": {
        backgroundColor: "#ffd6d6",
        transform: "scale(1.05)",
        transition: "all 0.3s ease-in-out",
      },
    };
  };

  const getHostelOwnerTextColor = () => {
    return isHostelOwnerPage ? "#ffffff" : "#D21B16";
  };

  return (
    <Box
      sx={{
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1100,
        backgroundColor: "white",
      }}
    >
      {/* Conditionally render EmailStrip only on desktop */}
      {!isMobileOrTablet && <EmailStrip />}

      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "none",
        }}
        className="bg-white"
      >
        <Toolbar className="justify-between items-center px-2 xs:px-3 sm:px-4 py-1 xs:py-2">
          {/* Logo Section - More Responsive Sizing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center cursor-pointer relative"
            onClick={handleLogoClick}
          >
            <Image
              src="/logo/lb.svg"
              alt="Latur Hostel Logo"
              width={0}
              height={0}
              className={`
                h-auto 
                mr-1 xs:mr-2
                ${
                  isMobile
                    ? "w-[100px] sm:w-[120px] mt-[5px] sm:mt-[30px]"
                    : "w-[120px] md:w-[150px] -mt-[53px]"
                }
                transform scale-90 xs:scale-100
              `}
              style={{
                objectFit: "contain",
              }}
              priority
            />
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobileOrTablet && (
            <Box className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderRadius: "24px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    marginRight: "16px",
                    ...getHostelOwnerButtonStyles(),
                  }}
                  onClick={() => router.push("/hostelownerlogin")}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: getHostelOwnerTextColor(),
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
                      <Hand size={20} color={getHostelOwnerTextColor()} />
                    </motion.div>
                  </Box>
                </Box>
                <NavigationContent
                  pathname={pathname}
                  onNavigate={handleNavigation}
                  isMobile={false}
                />
              </motion.div>
            </Box>
          )}

          {/* Mobile Menu Toggle */}
          {isMobileOrTablet && (
            <Box className="flex items-center">
              <CustomButton
                onClick={handleMobileMenuToggle}
                isMobile={isMobileOrTablet}
                className="transition-colors duration-300"
                ariaLabel="Toggle menu"
              />
            </Box>
          )}
        </Toolbar>

        {/* Mobile Drawer Menu */}
        {/* Mobile Drawer Menu */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{
            "& .MuiDrawer-paper": {
              width: { xs: "250px", sm: "300px" },
              bgcolor: "rgb(240 249 255)",
              paddingTop: { xs: "10px", sm: "20px" },
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleMobileMenuClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List sx={{ flexGrow: 1 }}>
            <ListItem>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 16px",
                  borderRadius: "24px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  marginBottom: "16px",
                  ...getHostelOwnerButtonStyles(),
                }}
                onClick={() => router.push("/hostelownerlogin")}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: getHostelOwnerTextColor(),
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
                    <Hand size={20} color={getHostelOwnerTextColor()} />
                  </motion.div>
                </Box>
              </Box>
            </ListItem>
            <NavigationContent
              pathname={pathname}
              onNavigate={handleNavigation}
              isMobile={true}
            />
          </List>

          {/* Added email section at the bottom */}
          <Box
            sx={{
              padding: "16px",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              textAlign: "center",
              backgroundColor: "rgb(230, 240, 250)",
            }}
          >
            <Typography
              variant="body2"
              sx={{ marginBottom: "8px", color: "text.secondary" }}
            >
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: "4px" }}>
              contact@laturhostel.com
            </Typography>
            <Typography variant="body2">admin@laturhostel.com</Typography>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
});

export default Navbar;
