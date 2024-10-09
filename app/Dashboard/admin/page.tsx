"use client";
import React, { useEffect, useState } from "react";
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
import Students from "./components/Students";
import Hostels from "./components/Hostels";
import Owners from "./components/Owners";
import Tasks from "./components/Tasks";

import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Box,
  CssBaseline,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Group as StudentsIcon,
  Business as HostelsIcon,
  Assignment as TasksIcon,
  Logout as LogoutIcon,
  Person as OwnerIcon,
  Security as UACIcon,
  Menu as MenuIcon,
  PieChart,
} from "@mui/icons-material";
import Page from "./uac/Page";
import { API_BASE_URL } from "@/config/api";

const drawerWidth = 280;

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  value: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Dashboard", icon: <DashboardIcon />, value: "dashboard" },
  { name: "Students", icon: <StudentsIcon />, value: "students" },
  { name: "Hostel Owners", icon: <OwnerIcon />, value: "owners" },
  { name: "Hostels", icon: <HostelsIcon />, value: "hostels" },
  { name: "UAC", icon: <UACIcon />, value: "uac" },
  { name: "Tasks", icon: <TasksIcon />, value: "tasks" },
];

interface DashboardCardProps {
  title: string;
  icon: IconDefinition;
  color: string;
  count?: number;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  color,
  count,
  onClick,
}) => (
  <div
    className="bg-white p-6 rounded-2xl text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1 hover:bg-sky-50"
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className={`p-3 rounded-full ${color}`}>
        <FontAwesomeIcon icon={icon} className="h-6 w-6 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold">{count}</p>
    <p className="text-gray-400 mt-2">Click to view details</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [adminName, setAdminName] = useState<string>("Admin User");
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [ownersCount, setOwnersCount] = useState<number>(0);
  const [hostelsCount, setHostelsCount] = useState<number>(0);
  const [approvedHostelsCount, setApprovedHostelsCount] = useState<number>(0);
  const [approvedWishlistCount, setApprovedWishlistCount] = useState<number>(0);
  const [pendingWishlistCount, setPendingWishlistCount] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setIsAuthenticated(true);

    const fetchData = async () => {
      try {
        const [studentsRes, ownersRes, hostelsRes] = await Promise.all([
          axios.get<any[]>(`${API_BASE_URL}/api/admin/students`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<any[]>(`${API_BASE_URL}/api/admin/owners`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get<any[]>(`${API_BASE_URL}/api/admin/hostels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const students = studentsRes.data;
        setStudentsCount(students.length);
        setOwnersCount(ownersRes.data.length);
        setHostelsCount(hostelsRes.data.length);

        let approvedCount = 0;
        let pendingCount = 0;

        students.forEach((student: any) => {
          if (student.wishlist && student.wishlist.length > 0) {
            if (student.wishlistApproved === "true") {
              approvedCount++;
            } else {
              pendingCount++;
            }
          }
        });

        setApprovedWishlistCount(approvedCount);
        setPendingWishlistCount(pendingCount);

        const verifiedHostels = hostelsRes.data.filter(
          (hostel: any) => hostel.verified
        );

        setApprovedHostelsCount(verifiedHostels.length);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
      await logoutUser();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("profileId");
      localStorage.removeItem("email");

      window.location.href = "/";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const cardData = [
    {
      title: "Students",
      icon: faUser,
      color: "bg-white",
      count: studentsCount,
      page: "students",
    },
    {
      title: "Hostel Owners",
      icon: faBuilding,
      color: "bg-yellow-400",
      count: ownersCount,
      page: "owners",
    },
    {
      title: "Approved Hostels",
      icon: faCheckCircle,
      color: "bg-green-400",
      count: approvedHostelsCount,
      page: "hostels",
    },
    {
      title: "Pending Wishlist",
      icon: faClock,
      color: "bg-red-400",
      count: pendingWishlistCount,
      page: "tasks",
    },
    {
      title: "Total Hostels",
      icon: faList,
      color: "bg-purple-400",
      count: hostelsCount,
      page: "hostels",
    },
    {
      title: "Approved Wishlist",
      icon: faThumbsUp,
      color: "bg-indigo-400",
      count: approvedWishlistCount,
      page: "tasks",
    },
    {
      title: "UAC",
      icon: faUser,
      color: "bg-purple-400",
      page: "uac",
    },
  ];
  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        my: 1,
        mx: 1,
        bgcolor: "white",
        color: "black",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
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
              bgcolor:
                activePage === item.value
                  ? "rgba(14, 165, 233, 0.1)"
                  : "transparent",
              "&:hover": {
                bgcolor:
                  activePage === item.value
                    ? "rgba(14, 165, 233, 0.2)"
                    : "rgba(14, 165, 233, 0.1)",
              },
              transition: "background-color 0.3s",
            }}
          >
            <ListItemIcon
              sx={{
                mb: 1,
                borderRadius: "10px",
                color: activePage === item.value ? "rgb(14, 165, 233)" : "gray",
                transition: "color 0.3s",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: activePage === item.value ? "bold" : "medium",
                fontSize: activePage === item.value ? "1rem" : "0.875rem",
                color: activePage === item.value ? "rgb(14, 165, 233)" : "gray",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "white", color: "black" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "white",
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", height: "90px" }}>
          <Typography
            variant="h6"
            noWrap
            color="rgb(14, 165, 233)"
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Admin Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon sx={{ color: "rgb(14, 165, 233)" }} />
            </IconButton>
            <Avatar sx={{ mr: 2, bgcolor: "rgb(14, 165, 233)" }}>
              {adminName.charAt(0)}
            </Avatar>
            <Typography
              variant="subtitle1"
              sx={{ mr: 2, fontWeight: "medium", color: "gray" }}
            >
              {adminName}
            </Typography>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                background: "linear-gradient(45deg, #0EA5E9 30%, #38BDF8 90%)",
                color: "white",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #0369A1 30%, #0EA5E9 90%)",
                },
                textTransform: "none",
                borderRadius: "20px",
                boxShadow: "0 3px 5px 2px rgba(14, 165, 233, .3)",
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "white",
            color: "black",
            border: "1px solid rgba(14, 165, 233, 0.2)",
            margin: 2,
            borderRadius: "20px",
            padding: "10px",
            marginTop: "80px",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "white",
            color: "black",
            border: "1px solid rgba(14, 165, 233, 0.2)",
            margin: 2,
            borderRadius: "25px",
            padding: "10px",
            marginTop: "100px",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: { xs: 10, sm: 11 }, ml: { xs: 2, sm: 3 } }}
      >
        <div className="p-8 bg-white min-h-screen">
          {activePage === "dashboard" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {cardData.map((card, index) => (
                  <DashboardCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    color={`bg-gradient-to-r from-sky-400 to-sky-500`}
                    count={card.count}
                    onClick={() => setActivePage(card.page)}
                  />
                ))}
              </div>
              {/* <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  User Distribution
                </h3>
                <PieChart
                  studentsCount={studentsCount}
                  ownersCount={ownersCount}
                />
              </div> */}
            </>
          ) : activePage === "students" ? (
            <Students />
          ) : activePage === "hostels" ? (
            <Hostels />
          ) : activePage === "owners" ? (
            <Owners />
          ) : activePage === "uac" ? (
            <Page />
          ) : activePage === "tasks" ? (
            <Tasks />
          ) : null}
        </div>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
