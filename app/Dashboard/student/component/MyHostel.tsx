import React, { useState, useEffect } from "react";
import AdmittedHostelCard from "./AdmittedHostelCard";
import { API_BASE_URL } from "@/config/api";

const MyHostel: React.FC = () => {
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    const fetchHostelData = async () => {
      const profileId = localStorage.getItem("profileId");
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/students/${profileId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch hostel data");
        }
        const data = await response.json();
        setHostel(data.admittedHostel);
      } catch (err) {}
    };

    fetchHostelData();
  }, []);
  console.log("hostel", hostel);
  return (
    <div>
      <AdmittedHostelCard hostel={hostel} />
    </div>
  );
};

export default MyHostel;
