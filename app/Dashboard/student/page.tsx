"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { withAuth } from "../../utils/auth";
import { useAuth } from "../../utils/auth";

const DashboardStudentClient = dynamic(
  () => import("./component/DashboardStudentClient"),
  { ssr: false }
);

const DashboardStudent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <div>You need to login to access this page.</div>;
  }

  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardStudentClient />
    </Suspense>
  );
};

export default withAuth(DashboardStudent);
