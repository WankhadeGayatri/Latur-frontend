import React, { useState, useEffect } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  LinearProgress,
  Typography,
  Badge,
} from "@mui/material";
import {
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useNotification } from "./NotificationProvider";

interface ProfileData {
  name?: string;
  number?: string;
  email?: string;
  class?: string;
  year?: string;
  school?: string;
  city?: string;
  address?: string;
  parentname?: string;
  parentnumber?: string;
  passportPhoto?: string;
  gender?: string;
  [key: string]: any; // To allow indexing with string
}

interface Notification {
  severity: "warning" | "info" | "success";
  title: string;
  message: string;
  icon: React.ReactElement;
}

interface ProfileNotificationsProps {
  profileData: ProfileData;
}

const ProfileNotifications: React.FC<ProfileNotificationsProps> = ({
  profileData,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const { updateNotificationCount } = useNotification();

  const requiredFields: (keyof ProfileData)[] = [
    "name",
    "number",
    "email",
    "class",
    "year",
    "school",
    "city",
    "address",
    "parentname",
    "parentnumber",
    "passportPhoto",
    "gender",
  ];

  useEffect(() => {
    const missingFields = requiredFields.filter((field) => !profileData[field]);
    const newNotifications: Notification[] = [];

    if (missingFields.length > 0) {
      newNotifications.push({
        severity: "warning",
        title: "Profile Incomplete",
        message: `Please complete the following fields: ${missingFields.join(
          ", "
        )}.`,
        icon: <WarningIcon />,
      });
    }

    if (!profileData.passportPhoto) {
      newNotifications.push({
        severity: "info",
        title: "Profile Picture Missing",
        message: "Upload a profile picture to personalize your account.",
        icon: <InfoIcon />,
      });
    }

    setNotifications(newNotifications);
    updateNotificationCount(newNotifications.length);

    // Calculate completion percentage
    const completedFields = requiredFields.filter(
      (field) => profileData[field]
    ).length;
    const percentage = (completedFields / requiredFields.length) * 100;
    setCompletionPercentage(Math.round(percentage));
  }, [profileData, updateNotificationCount]);

  return (
    <Box sx={{ mb: 4 }}>
      {notifications.map((notification, index) => (
        <Alert
          key={index}
          severity={notification.severity}
          icon={notification.icon}
          sx={{ mb: 2 }}
        >
          <AlertTitle>{notification.title}</AlertTitle>
          {notification.message}
        </Alert>
      ))}

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                borderRadius: 5,
                backgroundColor:
                  completionPercentage === 100 ? "#4caf50" : "#2196f3",
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight="bold"
          >{`${completionPercentage}%`}</Typography>
        </Box>
      </Box>

      {completionPercentage === 100 && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
          <AlertTitle>Profile Complete</AlertTitle>
          Your profile is now 100% complete. Great job!
        </Alert>
      )}
    </Box>
  );
};

export default ProfileNotifications;
