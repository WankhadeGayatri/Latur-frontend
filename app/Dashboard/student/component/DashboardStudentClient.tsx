"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  CssBaseline,
  IconButton,
  Snackbar,
  Container,
  Paper,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Report as ComplaintsIcon,
  ThumbUp as FeedbackIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WishlistProvider, useWishlist } from "./WishlistContext";
import Hostel from "./Hostel";
import UserProfile from "./UserProfile";
import WishlistPage from "../wishlist/page";
import ProfileNotifications from "./ProfileNotifications";
import { NotificationProvider, useNotification } from "./NotificationProvider";
import { Building } from "lucide-react";
import MyHostel from "./MyHostel";
import ComplaintDashboard from "./ComplaintDashboard";
import FeedbackDisplay from "./FeedbackDisplay";

import Visits from "./Visits";
import { API_BASE_URL } from "@/config/api";

const drawerWidth = 240;

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  value: string;
  locked?: boolean;
}

const StudentDashboardContent: React.FC = () => {
  const [activePage, setActivePage] = useState("home");
  const [userData, setUserData] = useState({
    name: "",
    studentId: "",
    email: "",
    number: "",
    admittedHostel: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { notificationCount } = useNotification();
  const { wishlistCount } = useWishlist();
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileId = localStorage.getItem("profileId");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found, please login first.");
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `${API_BASE_URL}/api/students/${profileId}`,
        config
      );
      setUserData(response.data);

      if (response.data.passportPhoto) {
        const photoResponse = await axios.get(
          `${API_BASE_URL}/api/students/getphoto/${profileId}`,
          {
            responseType: "blob",
            ...config,
          }
        );
        setPreviewImage(URL.createObjectURL(photoResponse.data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logoutUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`${API_BASE_URL}/api/auth/student/logout`, {}, config);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogout = async () => {
    try {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sidebarItems: SidebarItem[] = [
    { name: "Home", icon: <HomeIcon />, value: "home" },
    { name: "My Profile", icon: <PersonIcon />, value: "profile" },
    { name: "Wishlist", icon: <FavoriteIcon />, value: "wishlist" },
    {
      name: "My Visits",
      icon: <Building />,
      value: "visit",
    },
    {
      name: "My Hostel Data",
      icon: <Building />,
      value: "myhostel",
      locked: !userData.admittedHostel,
    },
    {
      name: "My Complaints",
      icon: <ComplaintsIcon />,
      value: "complaint",
      locked: !userData.admittedHostel,
    },
    {
      name: "My Feedback",
      icon: <FeedbackIcon />,
      value: "feedback",
      locked: !userData.admittedHostel,
    },
    {
      name: "Notifications",
      icon: <NotificationsIcon />,
      value: "notifications",
    },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? drawerWidth : 56,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerOpen ? drawerWidth : 56,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #4A90E2 0%, #1C4B82 100%)",
            color: "white",
            borderRight: "none",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            boxShadow: "4px 0px 10px rgba(0, 0, 0, 0.1)",
            overflowX: "hidden",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        {/* Drawer content */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
          }}
        >
          <IconButton
            onClick={toggleDrawer}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: "grey",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          {drawerOpen && (
            <>
              <Image
                src="/Images/NewLogo1.png"
                alt="Hostel Logo"
                width={100}
                height={100}
              />
              <span className="text-white-500">Latur hostel</span>
            </>
          )}
          <Avatar
            src={previewImage || undefined}
            sx={{
              bgcolor: "transparent",
              width: 80,
              height: 80,
              fontSize: "1.75rem",
              mb: 1,
              mt: 4,
              border: "3px solid white",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {!previewImage && getInitials(userData.name)}
          </Avatar>
          {drawerOpen && (
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)",
                borderRadius: "10px",
                padding: "10px",
                width: "100%",
                textAlign: "center",
                marginBottom: 2,
              }}
            >
              <Typography
                variant="subtitle1"
                noWrap
                sx={{ fontWeight: "bold", textAlign: "center", mb: 0.5 }}
              >
                {userData.name}
              </Typography>
              <Typography variant="body2" noWrap>
                {userData.number}
              </Typography>
            </Box>
          )}
        </Box>
        <List>
          {sidebarItems.map((item) => (
            <Tooltip
              key={item.name}
              title={item.locked ? "Take admission and unlock the feature" : ""}
              placement="right"
            >
              <ListItem
                button
                onClick={() => !item.locked && setActivePage(item.value)}
                sx={{
                  mb: 1,
                  mx: 1,
                  borderRadius: "20px",
                  background:
                    activePage === item.value
                      ? "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.3) 100%)"
                      : "transparent",
                  color: "white",
                  transition: "all 0.3s",
                  justifyContent: drawerOpen ? "flex-start" : "center",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.4) 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  },
                  opacity: item.locked ? 0.5 : 1,
                  cursor: item.locked ? "not-allowed" : "pointer",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "white",
                    minWidth: drawerOpen ? "40px" : "auto",
                  }}
                >
                  {item.locked ? (
                    <LockIcon />
                  ) : item.value === "wishlist" ? (
                    <Badge badgeContent={wishlistCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : item.value === "notifications" ? (
                    <Badge badgeContent={notificationCount} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                {drawerOpen && (
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontWeight: activePage === item.value ? "bold" : "medium",
                      fontSize: "1rem",
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Box sx={{ mt: "auto", mb: 2, mx: 1 }}>
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.2) 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0.3) 100%)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              <LogoutIcon />
            </ListItemIcon>
            {drawerOpen && <ListItemText primary="Logout" />}
          </ListItem>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s ease-in-out",
          marginLeft: drawerOpen ? `2%` : "56px",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: 1,
              borderRadius: 4,
              background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            {activePage === "home" && <Hostel />}
            {activePage === "profile" && <UserProfile />}
            {activePage === "wishlist" && <WishlistPage />}
            {activePage === "visit" && <Visits />}
            {activePage === "notifications" && (
              <ProfileNotifications profileData={userData} />
            )}
            {activePage === "myhostel" && userData.admittedHostel && (
              <MyHostel />
            )}
            {activePage === "complaint" && userData.admittedHostel && (
              <ComplaintDashboard />
            )}
            {activePage === "feedback" && userData.admittedHostel && (
              <FeedbackDisplay />
            )}
          </Paper>
        </Container>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

const DashboardStudentClient: React.FC = () => (
  <WishlistProvider>
    <NotificationProvider>
      <StudentDashboardContent />
    </NotificationProvider>
  </WishlistProvider>
);

export default DashboardStudentClient;
