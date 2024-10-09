"use client";
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Search,
  Home,
  Book,
  School,
  EmojiEvents,
  MoneyOff,
  Person,
  Block,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#ff4081",
    },
    background: {
      paper: "#ffffff",
    },
  },
});

// Dotted Arrow Component
const DottedArrow: React.FC<{ direction: "right" | "left" }> = ({
  direction,
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: direction === "right" ? "flex-start" : "flex-end",
      alignItems: "center",
      width: "100%",
      mt: 2, // Add margin-top for spacing
    }}
  >
    <Box
      sx={{
        width: "30px",
        height: "2px",
        background: theme.palette.primary.main,
        borderRadius: "1px",
        margin: "0 5px",
        position: "relative",
      }}
    />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "10px",
      }}
    >
      <span style={{ fontSize: "8px", color: theme.palette.primary.main }}>
        •
      </span>
      <span style={{ fontSize: "8px", color: theme.palette.primary.main }}>
        •
      </span>
      <span style={{ fontSize: "8px", color: theme.palette.primary.main }}>
        •
      </span>
    </Box>
    <Box
      sx={{
        width: "30px",
        height: "2px",
        background: theme.palette.primary.main,
        borderRadius: "1px",
        margin: "0 5px",
        position: "relative",
      }}
    />
  </Box>
);

const StepItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  align: "left" | "right";
}> = ({ icon, text, align }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: align === "left" ? "flex-start" : "flex-end",
      width: "100%",
    }}
  >
    {align === "left" && (
      <Paper
        elevation={3}
        sx={{ p: 0.5, mr: 1, borderRadius: "50%", bgcolor: "primary.main" }}
      >
        <Box sx={{ color: "background.paper", fontSize: "1rem" }}>{icon}</Box>
      </Paper>
    )}
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 1,
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        width: "60%",
        textAlign: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
          fontWeight: "bold",
          fontSize: "0.9rem",
        }}
      >
        {text}
      </Typography>
    </Box>
    {align === "right" && (
      <Paper
        elevation={3}
        sx={{ p: 0.5, ml: 1, borderRadius: "50%", bgcolor: "secondary.main" }}
      >
        <Box sx={{ color: "background.paper", fontSize: "1rem" }}>{icon}</Box>
      </Paper>
    )}
  </Box>
);

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Paper
      elevation={2}
      sx={{ p: 1, mr: 1, borderRadius: "50%", bgcolor: "secondary.light" }}
    >
      <Box sx={{ color: "background.paper", fontSize: "1rem" }}>{icon}</Box>
    </Paper>
    <Typography
      variant="body2"
      sx={{ color: "text.secondary", fontSize: "1rem", fontWeight: "bold" }}
    >
      {text}
    </Typography>
  </Box>
);

const HostelSearch: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Left Div */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            margin: 1,
            borderRadius: "16px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundImage: "url('/Images/blur-bg.jpg')",
            backgroundSize: "cover",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "primary.main",
              fontWeight: "bold",
              textAlign: "left",
            }}
          >
            Home Away from Home
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StepItem
              icon={<Search />}
              text="Search Your Hostel"
              align="left"
            />
            <DottedArrow direction="right" />
            <StepItem icon={<Home />} text="Visit Your Hostel" align="right" />
            <DottedArrow direction="left" />
            <StepItem icon={<Book />} text="Book Your Hostel" align="left" />
            <DottedArrow direction="right" />
            <StepItem
              icon={<School />}
              text="Focus On Your Studies"
              align="right"
            />
            <DottedArrow direction="left" />
            <StepItem
              icon={<EmojiEvents />}
              text="Achieve Success"
              align="left"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", mb: 1, fontSize: "1rem" }}
            >
              We Manage Your Stay
            </Typography>
            <FeatureItem icon={<MoneyOff />} text="No Hidden Charges" />
            <FeatureItem icon={<Person />} text="No Middle Man" />
            <FeatureItem icon={<Block />} text="No Brokerage" />
          </Box>

          <Box sx={{ mt: 2, width: "100%" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Find your Hostel"
              InputProps={{
                startAdornment: (
                  <Search
                    sx={{ mr: 1, color: "primary.main", fontSize: "1rem" }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  height: "48px",
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 16px",
                  fontSize: "1rem",
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Div */}
        <Box
          sx={{
            flex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "16px",
            overflow: "hidden",
            margin: 1,
          }}
        >
          <Box
            component="img"
            src="/Images/front.jpg"
            alt="City buildings with students"
            sx={{
              width: "88", // Set to 100% for full width
              height: "100%", // Set to 100% for full height
              objectFit: "cover",
              borderRadius: "16px",
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HostelSearch;
