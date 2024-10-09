import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  Grid,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import { Alert } from "@mui/material";
import { API_BASE_URL } from "@/config/api";

interface Feedback {
  _id: string;
  hostelName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Student {
  admittedHostel: {
    _id: string;
  } | null;
}

const GradientCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  borderRadius: 15,
  transition: "0.3s",
  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
  "&:hover": {
    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
  },
}));

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ffeb3b",
  },
  "& .MuiRating-iconHover": {
    color: "#ffd700",
  },
});

const FeedbackDisplay: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openFeedbackDialog, setOpenFeedbackDialog] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<number | null>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const profileId = localStorage.getItem("profileId");
      if (!profileId) {
        setError("Profile ID not found in local storage");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get<{ feedback: Feedback[] }>(
          `${API_BASE_URL}/api/students/${profileId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudent(response.data as unknown as Student);
        setFeedback(response.data.feedback);
        setIsLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const submitFeedback = async () => {
    if (!student?.admittedHostel) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/students/submit-feedback`,
        {
          hostelId: student.admittedHostel._id,
          rating: feedbackRating,
          comment: feedbackComment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSnackbarMessage("Feedback submitted successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenFeedbackDialog(false);
      setFeedbackRating(0);
      setFeedbackComment("");

      // Refresh feedback data
      const updatedResponse = await axios.get<{ feedback: Feedback[] }>(
        `${API_BASE_URL}/api/students/${localStorage.getItem("profileId")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFeedback(updatedResponse.data.feedback);
    } catch (error) {
      setSnackbarMessage("Error submitting feedback. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        className="bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <LinearProgress className="w-1/2 mb-4" />
        <Typography variant="h6" className="text-blue-600">
          Loading Feedback...
        </Typography>
      </Box>
    );
  }

  if (error)
    return (
      <Typography align="center" color="error">
        {error}
      </Typography>
    );

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        My Feedback
      </Typography>
      {student?.admittedHostel && (
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenFeedbackDialog(true)}
          >
            Submit Feedback
          </Button>
        </Box>
      )}
      <Grid container spacing={4}>
        {feedback.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <GradientCard>
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  color="white"
                >
                  {item.hostelName}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <StyledRating
                    name="read-only"
                    value={item.rating}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" color="white" sx={{ ml: 1 }}>
                    ({item.rating}/5)
                  </Typography>
                </Box>
                <Typography variant="body2" color="white" paragraph>
                  {item.comment}
                </Typography>
                <Typography variant="caption" color="white">
                  {new Date(item.date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </GradientCard>
          </Grid>
        ))}
      </Grid>
      <Dialog
        open={openFeedbackDialog}
        onClose={() => setOpenFeedbackDialog(false)}
      >
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Rating
            name="rating"
            value={feedbackRating}
            onChange={(event, newValue) => {
              setFeedbackRating(newValue);
            }}
          />
          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFeedbackDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={submitFeedback} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackDisplay;
