"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  DoughnutController,
} from "chart.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { API_BASE_URL } from "@/config/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  DoughnutController
);
interface HostelCardProps {
  hostel: {
    _id: string;
    name: string;
    address: string;
    beds: number;
    studentsPerRoom: number;
    fetchedImages?: { contentType: string; data: string }[];
  };
}
interface Hostel {
  _id: string;
  name: string;
  address: string;
  beds: number;
  studentsPerRoom: number;
  fetchedImages?: { contentType: string; data: string }[];
  hostelType: string;
  feedback?: any[];
}

interface HostelState {
  _id: string;
  name: string;
  address: string;
  beds: number;
  studentsPerRoom: number;
  fetchedImages?: { contentType: string; data: string }[];
}

interface Complaint {
  status: "resolved" | "open";
}

interface HostelResponse {
  hostels: Hostel[];
}

interface Stats {
  totalHostels: number;
  totalBeds: number;
  totalStudents: number;
  girlsHostels: number;
  boysHostels: number;
  resolvedComplaints: number;
  openComplaints: number;
  totalFeedbacks: number;
}

const HostelCard: React.FC<HostelCardProps> = ({ hostel }) => (
  <Card className="bg-white text-gray-800 h-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-lg overflow-hidden">
    <CardContent>
      <Box className="relative overflow-hidden rounded-lg mb-4 shadow-md">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          className="w-full md:w-48 h-40 md:h-auto rounded-lg"
        >
          {hostel.fetchedImages && hostel.fetchedImages.length > 0 ? (
            hostel.fetchedImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`data:${image.contentType};base64,${image.data}`}
                  alt={`${hostel.name} - ${index + 1}`}
                  className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <p className="text-gray-500">No images available</p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </Box>
      <Typography variant="h6" className="font-bold mb-2 text-gray-900">
        {hostel.name}
      </Typography>
      <Typography variant="body2" className="text-gray-600 mb-1">
        {hostel.address}
      </Typography>
      <Typography variant="body2" className="text-gray-600">
        Beds: <span className="font-semibold">{hostel.beds}</span> |
        Students/Room:{" "}
        <span className="font-semibold">{hostel.studentsPerRoom}</span>
      </Typography>
    </CardContent>
  </Card>
);

interface FeesCardProps {
  label: string;
  amount: number | string;
  color: string;
}

const FeesCard: React.FC<FeesCardProps> = ({ label, amount, color }) => (
  <Card
    className={`bg-gradient-to-r ${color} text-white mb-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg`}
  >
    <CardContent>
      <Typography variant="h6" className="font-bold">
        {label}
      </Typography>
      <Typography variant="h4" className="font-extrabold mt-2">
        {amount}
      </Typography>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [ownerFormOpen, setOwnerFormOpen] = useState<boolean>(false);
  const [hostels, setHostels] = useState<HostelCardProps["hostel"][]>([]);
  const [stats, setStats] = useState<{
    totalHostels: number;
    totalBeds: number;
    totalStudents: number;
    girlsHostels: number;
    boysHostels: number;
    resolvedComplaints: number;
    openComplaints: number;
    totalFeedbacks: number;
  }>({
    totalHostels: 0,
    totalBeds: 0,
    totalStudents: 0,
    girlsHostels: 0,
    boysHostels: 0,
    resolvedComplaints: 0,
    openComplaints: 0,
    totalFeedbacks: 0,
  });
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const profileId = localStorage.getItem("profileId");
        const token = localStorage.getItem("token");
        if (!profileId || !token) throw new Error("Authentication error");

        const hostelResponse = await axios.get<HostelResponse>(
          `${API_BASE_URL}/api/hostels/${profileId}/hostels`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const fetchedHostels: Hostel[] = hostelResponse.data.hostels;
        setHostels(fetchedHostels);
        // Calculate stats
        const totalBeds = fetchedHostels.reduce(
          (sum, hostel) => sum + hostel.beds,
          0
        );
        const totalStudents = fetchedHostels.reduce(
          (sum, hostel) => sum + hostel.beds * hostel.studentsPerRoom,
          0
        );
        const girlsHostels = fetchedHostels.filter(
          (hostel) => hostel.hostelType === "girls"
        ).length;
        const boysHostels = fetchedHostels.filter(
          (hostel) => hostel.hostelType === "boys"
        ).length;

        // Fetch complaints and feedbacks
        let resolvedComplaints = 0;
        let openComplaints = 0;
        let totalFeedbacks = 0;

        for (const hostel of fetchedHostels) {
          const complaintsResponse = await axios.get<{
            complaints: Complaint[];
          }>(`${API_BASE_URL}/api/hostels/${hostel._id}/complaints`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          resolvedComplaints += complaintsResponse.data.complaints.filter(
            (c) => c.status === "resolved"
          ).length;
          openComplaints += complaintsResponse.data.complaints.filter(
            (c) => c.status === "open"
          ).length;

          totalFeedbacks += hostel.feedback ? hostel.feedback.length : 0;
        }

        setStats({
          totalHostels: fetchedHostels.length,
          totalBeds,
          totalStudents,
          girlsHostels,
          boysHostels,
          resolvedComplaints,
          openComplaints,
          totalFeedbacks,
        });

        fetchedHostels.forEach(async (hostel) => {
          try {
            const imageResponse = await axios.get<
              { contentType: string; data: string }[]
            >(`${API_BASE_URL}/api/hostels/gethostalphotos/${hostel._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setHostels((prevHostels) =>
              prevHostels.map((h) =>
                h._id === hostel._id
                  ? { ...h, fetchedImages: imageResponse.data }
                  : h
              )
            );
          } catch (error) {
            console.error(
              `Error fetching images for hostel ${hostel._id}`,
              error
            );
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const genderDistributionData = {
    labels: ["Girls Hostels", "Boys Hostels"],
    datasets: [
      {
        data: [stats.girlsHostels, stats.boysHostels],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const pieData = {
    labels: hostels.map((hostel) => hostel.name),
    datasets: [
      {
        data: hostels.map((hostel) => hostel.beds),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const complaintStatusData = {
    labels: ["Resolved Complaints", "Open Complaints"],
    datasets: [
      {
        data: [stats.resolvedComplaints, stats.openComplaints],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverBackgroundColor: ["#45a049", "#e6ae06"],
      },
    ],
  };

  const barData = {
    labels: [
      "Total Hostels",
      "Total Beds",
      "Total Students",
      "Resolved Complaints",
      "Open Complaints",
      "Total Feedbacks",
    ],
    datasets: [
      {
        label: "Statistics",
        data: [
          stats.totalHostels,
          stats.totalBeds,
          stats.totalStudents,
          stats.resolvedComplaints,
          stats.openComplaints,
          stats.totalFeedbacks,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        backgroundColor: "#f9f9f9",
        padding: 4,
        borderRadius: 2,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        className="text-gray-900 font-extrabold mb-6 text-center"
      >
        Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <FeesCard
            label="Total Hostels"
            amount={stats.totalHostels}
            color="from-blue-500 to-purple-500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeesCard
            label="Total Beds"
            amount={stats.totalBeds}
            color="from-green-500 to-teal-500"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FeesCard
            label="Total Students"
            amount={stats.totalStudents}
            color="from-red-500 to-orange-500"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-white text-gray-800 shadow-xl rounded-lg p-4">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                className="font-bold text-gray-900 mb-4"
              >
                Hostel Gender Distribution
              </Typography>
              <Doughnut data={genderDistributionData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-white text-gray-800 shadow-xl rounded-lg p-4">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                className="font-bold text-gray-900 mb-4"
              >
                Hostel Beds Distribution
              </Typography>
              <Pie data={pieData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-white text-gray-800 shadow-xl rounded-lg p-4">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                className="font-bold text-gray-900 mb-4"
              >
                Complaints Status
              </Typography>
              <Doughnut data={complaintStatusData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="bg-pink text-violet-800 shadow-xl rounded-lg p-4">
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                className="font-bold text-gray-900 mb-4"
              >
                Overview
              </Typography>
              <Bar data={barData} options={{ responsive: true }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Box className="bg-white shadow-xl rounded-lg p-6">
            <Typography
              variant="h6"
              gutterBottom
              className="font-bold text-gray-900 mb-4"
            >
              Hostels
            </Typography>
            <Grid container spacing={4}>
              {hostels.map((hostel) => (
                <Grid item xs={12} sm={6} md={4} key={hostel._id}>
                  <HostelCard hostel={hostel} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
