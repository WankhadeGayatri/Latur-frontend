"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import { styled } from "@mui/material/styles";
import { API_BASE_URL } from "@/config/api";

interface Feedback {
  id: string;
  hostelName: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  date: string;
}

interface Hostel {
  _id: string;
  name: string;
  feedback: Feedback[];
}

const GradientCard = styled(Card)(({ theme }) => ({
  background: "#f0f8ff", // Light blue background for the card
  borderRadius: "16px",
  transition: "all 0.3s ease-in-out",
  boxShadow: "0 8px 20px rgba(0, 0, 255, 0.3)", // Blue shadow for the card
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 16px 30px rgba(0, 0, 255, 0.4)", // Enhanced hover effect
  },
}));

const GradientChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(45deg, #1e90ff 30%, #00bfff 90%)", // Blue gradient for the chip
  color: "white",
  fontWeight: "bold",
  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)", // Subtle text shadow
}));

const NoticeButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #1e90ff 30%, #00bfff 90%)", // Gradient background for button
  border: 0,
  color: "white",
  padding: "8px 16px",
  borderRadius: "20px",
  boxShadow: "0 3px 5px 2px rgba(30, 144, 255, .3)", // Blue shadow for the button
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    background: "white",
    color: "#1e90ff", // Change text color on hover
    transform: "scale(1.05)",
    boxShadow: "0 4px 6px rgba(0, 0, 255, 0.3)", // Slightly increase shadow on hover
  },
}));

const FeedbackComponent: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const profileId = localStorage.getItem("profileId");
        const token = localStorage.getItem("token");
        if (profileId) {
          const response = await fetch(
            `${API_BASE_URL}/api/hostels/${profileId}/hostels`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await response.json();
          const formattedFeedbacks = data.hostels.flatMap((hostel: Hostel) =>
            hostel.feedback.map((item: any) => ({
              id: item._id,
              hostelName: hostel.name,
              rating: item.rating,
              comment: item.comment,
              isAnonymous: item.student.startsWith("Anonymous"),
              date: new Date(item.date).toLocaleDateString(),
            }))
          );
          setFeedbacks(formattedFeedbacks);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleNotice = (id: string) => {
    // Handle notice action
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#f0f8ff" }}>
      <Grid container spacing={4}>
        {feedbacks.map((feedback) => (
          <Grid item xs={12} sm={6} md={4} key={feedback.id}>
            <GradientCard className="h-full">
              <CardContent className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                  <GradientChip
                    label={feedback.hostelName}
                    className="font-semibold"
                  />
                  <Typography
                    variant="body2"
                    className="text-black-900 font-medium"
                  >
                    {feedback.date}
                  </Typography>
                </div>
                <Rating value={feedback.rating} readOnly className="mb-3" />
                <Typography
                  variant="body1"
                  className="mb-4 flex-grow text-black-300 font-medium"
                  style={{ lineHeight: "1.6" }}
                >
                  "{feedback.comment}"
                </Typography>
                <div className="flex justify-between items-center">
                  <Typography
                    variant="body2"
                    className="italic text-black-500 font-medium"
                  >
                    {feedback.isAnonymous
                      ? "👤 Anonymous student"
                      : "🎓 Student feedback"}
                  </Typography>
                  <NoticeButton
                    startIcon={<FlagIcon />}
                    size="small"
                    onClick={() => handleNotice(feedback.id)}
                  >
                    Notice
                  </NoticeButton>
                </div>
              </CardContent>
            </GradientCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FeedbackComponent;
