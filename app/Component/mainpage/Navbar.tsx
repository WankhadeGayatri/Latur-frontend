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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
const CloseIcon = dynamic(() => import("@mui/icons-material/Close"), {
  ssr: false,
});
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "lucide-react";

// Separate CustomButton component remains the same
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
          className="text-white"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>
    </motion.div>
  );
};

// Navigation content component that uses useSearchParams
const NavigationContent: React.FC<{
  pathname: string;
  onNavigate: (path: string, section?: string) => void;
}> = ({ pathname, onNavigate }) => {
  const searchParams = useSearchParams();

  const isActive = (path: string, section?: string) => {
    if (path === "/") {
      const currentSection = searchParams.get("section");
      if (section === "gallery") {
        return pathname === "/" && currentSection === "gallery";
      } else if (section === "home") {
        return pathname === "/" && !currentSection;
      }
    }
    return path !== "/" && pathname.startsWith(path);
  };

  const navItems = [
    { text: "Home", path: "/", section: "home" },
    { text: "About Us", path: "/aboutus" },
    { text: "Amenities", path: "/amenities" },
    { text: "Gallery", path: "/", section: "gallery" },
    { text: "Sign In", path: "/login" },
    { text: "Sign Up", path: "/register" },
  ];

  return (
    <>
      {navItems.map((item) => (
        <motion.div
          key={item.text}
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Typography
            onClick={() => onNavigate(item.path, item.section)}
            className={`text-sky-700 hover:text-sky-500 cursor-pointer transition-colors duration-300 ${
              isActive(item.path, item.section) ? "font-semibold" : ""
            }`}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {item.text}
          </Typography>
          {isActive(item.path, item.section) && (
            <motion.div
              className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500"
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const theme = useTheme();
  const [isBlinking, setIsBlinking] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const pathname = usePathname();

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

  const handleNavigation = (path: string, section?: string) => {
    if (path === "/" && section === "gallery") {
      if (pathname === "/") {
        const galleryElement = document.getElementById("gallery");
        if (galleryElement) {
          galleryElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        router.push("/?section=gallery");
      }
    } else {
      router.push(path);
    }
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
    return isHostelOwnerPage ? "#ffffff" : "#d32f2f";
  };

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
                  {isHostelOwnerPage && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-full rounded-3xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.15 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background:
                          "linear-gradient(45deg, #ff758c 0%, #ff7eb3 100%)",
                        filter: "blur(4px)",
                        zIndex: -1,
                      }}
                    />
                  )}
                </Box>
              </motion.div>
              <Suspense fallback={<div>Loading...</div>}>
                <NavigationContent
                  pathname={pathname}
                  onNavigate={handleNavigation}
                />
              </Suspense>
            </motion.div>
          )}

          {isMobile && (
            <CustomButton
              onClick={handleMobileMenuToggle}
              isMobile={isMobile}
              className="bg-sky-500 hover:bg-sky-600 transition-colors duration-300"
              ariaLabel="Toggle mobile menu"
            />
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
                padding: "10px 16px",
                borderRadius: "24px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                marginBottom: "16px",
                position: "relative",
                overflow: "hidden",
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
          <Suspense fallback={<div>Loading...</div>}>
            <NavigationContent
              pathname={pathname}
              onNavigate={(path, section) => {
                handleNavigation(path, section);
                handleMobileMenuClose();
              }}
            />
          </Suspense>
        </List>
      </Drawer>
    </AppBar>
  );
});

export default Navbar;
