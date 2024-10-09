import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const OAuthSuccessClient = dynamic(
  () => import("./component/OAuthSuccessClient"),
  { ssr: false }
);

const OAuthSuccess: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSuccessClient />
    </Suspense>
  );
};

export default OAuthSuccess;
