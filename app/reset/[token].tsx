// File: pages/reset/[token].tsx
import React, { Suspense } from "react";
import { Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";

const ResetForm = dynamic(() => import("./component/ResetForm"), {
  ssr: false,
  loading: () => <Typography>Loading...</Typography>,
});

const Reset: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <Box className="bg-white rounded-xl p-8 shadow-md w-full max-w-md">
        <Typography
          variant="h4"
          className="text-gray-800 text-center mb-6 font-bold"
        >
          Reset Password
        </Typography>
        <Suspense fallback={<Typography>Loading...</Typography>}>
          <ResetForm />
        </Suspense>
      </Box>
    </div>
  );
};

export default Reset;
