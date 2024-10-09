"use client";
import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Modal,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Hand } from "lucide-react";
import ExploreIcon from "@mui/icons-material/Explore";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import axios from "axios";

import NotificationsIcon from "@mui/icons-material/Notifications";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material";
import { Divider } from "@mui/material";
//import { Slide } from "@mui/material";
import { Grow } from "@mui/material";

interface HostelOwnerCTAProps {
  router: ReturnType<typeof useRouter>;
}

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  userRole: string;
  userPassword?: string;
}

const Navbar: React.FC = () => {
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  //const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateUserInfo = useCallback(() => {
    if (isClient) {
      const email = localStorage.getItem("email");
      const role = localStorage.getItem("role");
      const id = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");

      if (role && id && token) {
        if (role === "student") {
          setUserEmail(email);
        }
        setUserRole(role);
        setProfileId(id);
        setIsLoggedIn(true);
      } else {
        setUserEmail(null);
        setUserRole(null);
        setProfileId(null);
        setIsLoggedIn(false);
      }
    }
  }, [isClient]);

  const handleLoginClick = () => {
    setLoginModalOpen(true);
    document.body.classList.add("blur-background");
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
    document.body.classList.remove("blur-background");
  };

  const fetchWishlistCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("profileId");
    if (token && id && userRole === "student") {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/students/wishlist/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWishlistCount(data.length);
        } else {
          console.error("Failed to fetch wishlist");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    }
  }, [userRole]);

  useEffect(() => {
    updateUserInfo();
    fetchWishlistCount();

    const handleStorageChange = () => {
      updateUserInfo();
      fetchWishlistCount();
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      updateUserInfo();
      fetchWishlistCount();
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [updateUserInfo, fetchWishlistCount]);

  const handleWishlistClick = () => {
    router.push("/wishlist");
  };

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: string) => {
    handleClose();
    if (action === "signIn") {
      router.push("/login");
    } else if (action === "signUp") {
      router.push("/register");
    }
  };

  const logoutUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, config);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogout = async () => {
    try {
      setUserEmail(null);
      setUserRole(null);
      setProfileId(null);
      setIsLoggedIn(false);
      setProfileOpen(false);
      setAnchorEl(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      localStorage.removeItem("wishlist");
      await logoutUser();
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/";
    }
  };

  const handleExploreClick = () => {
    router.push("/explore");
  };

  const iconStyle =
    "text-sky-500 hover:text-sky-600 transition-all duration-200 shadow-md hover:shadow-lg";

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const mobileMenuItems = [
    { text: "Home", onClick: () => router.push("/") },
    { text: "Amenities", onClick: () => {} },
    { text: "About Us", onClick: () => {} },
    { text: "Gallery", onClick: () => {} },
  ];

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "background.paper" }}
      elevation={0}
    >
      <Toolbar
        className="flex justify-between items-center px-4 sm:px-8 py-2 sm:py-4"
        style={{ minHeight: "60px" }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            color="primary"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
          >
            <MenuIcon />
          </IconButton>
        )}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <Typography
            variant="h6"
            component="div"
            className="flex items-center text-sky-500 font-bold cursor-pointer"
            onClick={() => router.push("/")}
            sx={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Image
              src="/Images/NewLogo1.png"
              alt="Hostel Logo"
              width={isMobile ? 80 : 100}
              height={isMobile ? 80 : 100}
            />
            <span className="text-sky-500 text-sm sm:text-base">
              Latur hostel
            </span>
          </Typography>
        </motion.div>

        <Box className="flex items-center space-x-2 sm:space-x-6">
          {!isMobile && (
            <>
              <Typography
                color="primary"
                onClick={() => router.push("/")}
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Home
              </Typography>
              <Typography
                color="primary"
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Amenities
              </Typography>
              <Typography
                color="primary"
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                About Us
              </Typography>
              <Typography
                color="primary"
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Gallery
              </Typography>
              <Typography
                color="primary"
                onClick={() => router.push("/login")}
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Sign In
              </Typography>
              <Typography
                color="primary"
                onClick={() => router.push("/register")}
                className="text-sky-500 hover:text-sky-600 cursor-pointer font-semibold"
                sx={{
                  fontSize: "0.9rem",
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Sign Up
              </Typography>
            </>
          )}

          {isMobile && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="primary"
            >
              <AccountCircleIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        ModalProps={{
          keepMounted: true,
        }}
        SlideProps={{
          direction: "right",
          mountOnEnter: true,
          unmountOnExit: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: "250px",
            transition: "transform 0.3s ease-in-out",
          },
        }}
      >
        <List>
          {mobileMenuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                item.onClick();
                handleMobileMenuClose();
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {isMobile && (
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Grow}
          TransitionProps={{
            timeout: 200,
          }}
          sx={{
            "& .MuiPaper-root": {
              opacity: 0,
              transition: "opacity 0.2s ease-in-out",
              "&.MuiMenu-paper": {
                opacity: 1,
              },
            },
          }}
        >
          <MenuItem onClick={() => handleMenuItemClick("signIn")}>
            Sign In
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick("signUp")}>
            Sign Up
          </MenuItem>
        </Menu>
      )}

      <AnimatePresence>
        {loginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              open={loginModalOpen}
              onClose={handleCloseLoginModal}
              aria-labelledby="login-modal"
              aria-describedby="login-modal-description"
              className="flex items-center justify-center"
            >
              <Box>{/* <LoginPopUp onClose={handleCloseLoginModal} /> */}</Box>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body.blur-background::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        body.blur-background::before {
          opacity: 1;
        }
      `}</style>
    </AppBar>
  );
};

export default Navbar;
