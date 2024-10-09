import React, { useEffect } from "react";
import { useRouter } from "next/router";

const AuthSuccess: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (typeof token === "string") {
      // Store the token in localStorage
      localStorage.setItem("authToken", token);
      // Redirect to the dashboard or home page
      router.push("/dashboard");
    }
  }, [router]);

  return <div>Authentication successful. Redirecting...</div>;
};

export default AuthSuccess;
