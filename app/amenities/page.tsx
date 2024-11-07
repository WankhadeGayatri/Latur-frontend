// pages/amenities.tsx
"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  styled,
  Fade,
} from "@mui/material";
import {
  Wifi as WifiIcon,
  Coffee as CoffeeIcon,
  MenuBook as MenuBookIcon,
  WbSunny as WbSunnyIcon,
  Restaurant as RestaurantIcon,
  Security as SecurityIcon,
  DirectionsBus as DirectionsBusIcon,
  BoltRounded as BoltIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Footer from "../Component/mainpage/Footer";
import Navbar from "../Component/mainpage/Navbar";

// Types
interface AmenityItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgcolor: string;
}

// Styled Components - Now client-side only
const AmenityCard = styled(Paper)(({ theme }) => ({
  height: "100%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[8],
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const amenities: AmenityItem[] = [
  {
    icon: WifiIcon,
    title: "Free Wi-Fi",
    description: "High-speed internet access throughout the hostel",
    color: "#1976d2",
    bgcolor: "#e3f2fd",
  },
  {
    icon: CoffeeIcon,
    title: "Study Room",
    description: "Quiet space equipped with desks and chairs",
    color: "#7b1fa2",
    bgcolor: "#f3e5f5",
  },
  {
    icon: MenuBookIcon,
    title: "Library",
    description: "Well-stocked with academic and leisure books",
    color: "#388e3c",
    bgcolor: "#e8f5e9",
  },
  {
    icon: WbSunnyIcon,
    title: "Solar Powered",
    description: "Eco-friendly sustainable energy system",
    color: "#f57c00",
    bgcolor: "#fff3e0",
  },
  {
    icon: RestaurantIcon,
    title: "Mess Facility",
    description: "Nutritious meals served three times daily",
    color: "#e53935",
    bgcolor: "#ffebee",
  },
  {
    icon: SecurityIcon,
    title: "24/7 Security",
    description: "Round-the-clock security with CCTV surveillance",
    color: "#5e35b1",
    bgcolor: "#ede7f6",
  },
  {
    icon: DirectionsBusIcon,
    title: "Pick Up & Drop",
    description: "Scheduled transportation service",
    color: "#00897b",
    bgcolor: "#e0f2f1",
  },
  {
    icon: BoltIcon,
    title: "Power Backup",
    description: "Uninterrupted power supply with generators",
    color: "#6d4c41",
    bgcolor: "#efebe9",
  },
  {
    icon: HomeIcon,
    title: "Student Friendly",
    description: "Comfortable environment for students",
    color: "#0288d1",
    bgcolor: "#e1f5fe",
  },
];

const AmenitiesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Navbar />
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          py: { xs: 4, md: 8 },
          px: 2,
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                mb: 2,
                color: "primary.main",
              }}
            >
              Hostel Amenities
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Experience comfortable living with our comprehensive range of
              amenities designed to enhance your stay and academic journey.
            </Typography>
          </Box>

          {/* Amenities Grid */}
          <Grid container spacing={3}>
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in={true} timeout={(index + 1) * 200}>
                    <Paper
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        transition: "all 0.3s ease",
                        backgroundColor: "#ffffff",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                          borderColor: "#bde0fe",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          backgroundColor: "#f0f7ff",
                          mb: 2.5,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        <Icon
                          sx={{
                            fontSize: 28,
                            color: "#2196f3",
                          }}
                        />
                      </Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        align="center"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: "#1e2022",
                          fontSize: "1.1rem",
                        }}
                      >
                        {amenity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          lineHeight: 1.6,
                          color: "#677788",
                          fontSize: "0.875rem",
                        }}
                      >
                        {amenity.description}
                      </Typography>
                    </Paper>
                  </Fade>
                </Grid>
              );
            })}
          </Grid>

          {/* Contact Section */}
          <Box textAlign="center" mt={8}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Need more information about our amenities?
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Contact us at:{" "}
              <Box component="span" color="primary.main">
                support@laturhostel.com
              </Box>
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AmenitiesPage;
