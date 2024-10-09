import React, { useEffect } from "react";
import { useRouter } from "next/router";

const OAuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const { token, role, profileId } = router.query;
    if (token && role && profileId) {
      // Store the token and user info
      localStorage.setItem("token", token as string);
      localStorage.setItem("role", role as string);
      localStorage.setItem("profileId", profileId as string);

      // Redirect based on role
      switch (role) {
        case "student":
          router.push("/");
          break;
        case "hostelOwner":
          router.push("/Dashboard/hostalOwner");
          break;
        case "admin":
          router.push("/Dashboard/admin");
          break;
        default:
          router.push("/customizeDashboard");
      }
    }
  }, [router]);

  return <div>Authentication successful. Redirecting...</div>;
};

export default OAuthSuccess;
