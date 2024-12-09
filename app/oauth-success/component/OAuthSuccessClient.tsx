"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OAuthSuccessClient: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const profileId = searchParams.get("profileId");

    if (token && role && profileId) {
      // Store the token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("profileId", profileId);

      // Redirect based on role
      switch (role) {
        case "student":
          window.location.href = "/Dashboard/student";
          break;
        case "hostelOwner":
          window.location.href = "/Dashboard/hostalOwner";
          break;
        case "admin":
          window.location.href = "/Dashboard/admin";
          break;
        default:
          router.push("/customizeDashboard");
      }
    } else {
      console.error("Missing required parameters in OAuth callback");
      router.push("/login"); // Redirect to login page if parameters are missing
    }
  }, [router, searchParams]);

  return <div>Authentication successful. Redirecting...</div>;
};

export default OAuthSuccessClient;
