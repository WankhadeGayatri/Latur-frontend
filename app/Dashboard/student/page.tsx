import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const DashboardStudentClient = dynamic(
  () => import("./component/DashboardStudentClient"),
  { ssr: false }
);

const DashboardStudent: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardStudentClient />
    </Suspense>
  );
};

export default DashboardStudent;
