// app/utils/auth.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  id: string;
  role: string;
  profileId: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = jwtDecode(token) as DecodedToken;
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem("token");
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      router.push("/login");
    }
  };

  return { isAuthenticated, loading, login, logout };
};

// HOC to protect routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  return function WithAuth(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
