"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faCheckCircle,
  faClock,
  faList,
  faThumbsUp,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dashboard as DashboardIcon,
  Group as StudentsIcon,
  Business as HostelsIcon,
  Assignment as TasksIcon,
  Logout as LogoutIcon,
  Person as OwnerIcon,
} from "@mui/icons-material";
import axios from "axios";

import { useRouter } from "next/navigation";
import Students from "../components/Students";
import Hostels from "../components/Hostels";
import Owners from "../components/Owners";
import Tasks from "../components/Tasks";
import { API_BASE_URL } from "@/config/api";

interface SidebarItem {
  name: string;
  icon: JSX.Element;
  value: string;
}

interface Counts {
  studentsCount: number;
  ownersCount: number;
  hostelsCount: number;
  approvedHostelsCount: number;
  approvedWishlistCount: number;
  pendingWishlistCount: number;
}

interface Permissions {
  [key: string]: boolean;
}

interface DashboardCardProps {
  title: string;
  icon: IconDefinition;
  color: string;
  count: number;
  onClick: () => void;
}

const drawerWidth = 280;

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: <DashboardIcon />, value: "dashboard" },
  { name: "Students", icon: <StudentsIcon />, value: "student data " },
  { name: "Hostel Owners", icon: <OwnerIcon />, value: "Owners data" },
  { name: "Hostels", icon: <HostelsIcon />, value: "Hostel data" },
  { name: "Tasks", icon: <TasksIcon />, value: "approveWishlist of student" },
];

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  color,
  count,
  onClick,
}) => (
  <div
    className="bg-gradient-to-br from-sky-400 to-sky-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className={`p-3 rounded-full bg-white ${color}`}>
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-sky-600" />
      </div>
    </div>
    <p className="text-3xl font-bold">{count}</p>
    <p className="text-sky-100 mt-2">Click to view details</p>
  </div>
);

function Dashboard() {
  const [permissions, setPermissions] = useState<Permissions>({});
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [adminName, setAdminName] = useState<string>("Admin User");
  const [role, setRole] = useState<string>("");
  const [counts, setCounts] = useState<Counts>({
    studentsCount: 0,
    ownersCount: 0,
    hostelsCount: 0,
    approvedHostelsCount: 0,
    approvedWishlistCount: 0,
    pendingWishlistCount: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPermissions = async () => {
      const userRole = localStorage.getItem("role");
      setRole(userRole || "");
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/permissions/${userRole}`
        );
        const data = await response.json();
        setPermissions(data.permissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const token = localStorage.getItem("token");
    try {
      const [studentsRes, ownersRes, hostelsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/admin/owners`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/api/admin/hostels`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const students = studentsRes.data;
      const approvedHostels = hostelsRes.data.filter(
        (hostel: any) => hostel.verified
      );
      const approvedWishlist = students.filter(
        (student: any) =>
          student.wishlist &&
          student.wishlist.length > 0 &&
          student.wishlistApproved === "true"
      ).length;
      const pendingWishlist = students.filter(
        (student: any) =>
          student.wishlist &&
          student.wishlist.length > 0 &&
          student.wishlistApproved !== "true"
      ).length;

      setCounts({
        studentsCount: students.length,
        ownersCount: ownersRes.data.length,
        hostelsCount: hostelsRes.data.length,
        approvedHostelsCount: approvedHostels.length,
        approvedWishlistCount: approvedWishlist,
        pendingWishlistCount: pendingWishlist,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
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
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      localStorage.removeItem("wishlist");
      await logoutUser();
      window.dispatchEvent(new Event("storage"));
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");
      window.dispatchEvent(new Event("storage"));
      window.location.href = "/login";
    }
  };

  const drawer = (
    <Box sx={{ overflow: "auto", my: 1, mx: 1 }}>
      <List>
        {sidebarItems.map((item) => (
          <ListItem
            disablePadding
            component="button"
            key={item.name}
            onClick={() => setActivePage(item.value)}
            sx={{
              mb: 1,
              borderRadius: "10px",
              bgcolor: activePage === item.value ? "#4A90E2" : "transparent",
              "&:hover": {
                bgcolor:
                  activePage === item.value
                    ? "#4A90E2"
                    : "rgba(74, 144, 226, 0.1)",
              },
              transition: "background-color 0.3s",
              display:
                item.value === "dashboard" || permissions[item.value]
                  ? "flex"
                  : "none",
            }}
          >
            <ListItemIcon
              sx={{
                color: activePage === item.value ? "white" : "#4A90E2",
                minWidth: "40px",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: activePage === item.value ? "bold" : "medium",
                fontSize: activePage === item.value ? "1rem" : "0.875rem",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const cardData = [
    {
      title: "Students",
      icon: faUser,
      color: "bg-blue-400",
      count: counts.studentsCount,
      page: "student data",
    },
    {
      title: "Hostel Owners",
      icon: faBuilding,
      color: "bg-yellow-400",
      count: counts.ownersCount,
      page: "Owners data",
    },
    {
      title: "Approved Hostels",
      icon: faCheckCircle,
      color: "bg-green-400",
      count: counts.approvedHostelsCount,
      page: "Hostel data",
    },
    {
      title: "Pending Wishlist",
      icon: faClock,
      color: "bg-red-400",
      count: counts.pendingWishlistCount,
      page: "approveWishlist of student",
    },
    {
      title: "Total Hostels",
      icon: faList,
      color: "bg-purple-400",
      count: counts.hostelsCount,
      page: "Hostel data",
    },
    {
      title: "Approved Wishlist",
      icon: faThumbsUp,
      color: "bg-indigo-400",
      count: counts.approvedWishlistCount,
      page: "approveWishlist of student",
    },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "#f0f8ff", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "white",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          height: 80,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: "100%" }}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ fontWeight: "bold", color: "#0369a1" }}
          >
            {role} Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 2, bgcolor: "#0369a1", width: 48, height: 48 }}>
              {adminName.charAt(0)}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{ mr: 2, fontWeight: "medium", color: "#0369a1" }}
            >
              {role}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                bgcolor: "#0369a1",
                "&:hover": { bgcolor: "#0284c7" },
                textTransform: "none",
                borderRadius: "20px",
                px: 3,
                py: 1,
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "white",
            color: "#0369a1",
            borderRight: "none",
            margin: 2,
            borderRadius: "20px",
            padding: "10px",
            marginTop: "90px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", my: 1, mx: 1 }}>
          <List>
            {sidebarItems.map((item) => (
              <ListItem
                button
                key={item.name}
                onClick={() => setActivePage(item.value)}
                sx={{
                  mb: 1,
                  borderRadius: "10px",
                  bgcolor:
                    activePage === item.value ? "#e0f2fe" : "transparent",
                  color: "#0369a1",
                  "&:hover": {
                    bgcolor: activePage === item.value ? "#bae6fd" : "#e0f2fe",
                  },
                  transition: "all 0.3s",
                  display:
                    item.value === "dashboard" || permissions[item.value]
                      ? "flex"
                      : "none",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: activePage === item.value ? "#0369a1" : "#60a5fa",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: activePage === item.value ? "bold" : "medium",
                    fontSize: "1rem",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: 10, sm: 11 },
          ml: { xs: 2, sm: 3 },
          bgcolor: "#f0f8ff",
        }}
      >
        {activePage === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {cardData.map(
              (card, index) =>
                permissions[card.page] && (
                  <DashboardCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    color={card.color}
                    count={card.count}
                    onClick={() => setActivePage(card.page)}
                  />
                )
            )}
          </div>
        )}
        {activePage !== "dashboard" && (
          <Typography variant="h4" className="mb-6 font-bold text-sky-800">
            {sidebarItems.find((item) => item.value === activePage)?.name}
          </Typography>
        )}
        {activePage === "student data " && <Students />}
        {activePage === "Hostel data" && <Hostels />}
        {activePage === "Owners data" && <Owners />}

        {activePage === "approveWishlist of student" && <Tasks />}
      </Box>
    </Box>
  );
}

export default Dashboard;
