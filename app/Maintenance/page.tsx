import { Metadata } from "next";
import BackendErrorPage from "./components/BackendErrorPage";

export const metadata: Metadata = {
  title: "System Maintenance | Your Service Name",
  description:
    "Our system is currently undergoing maintenance. We apologize for any inconvenience.",
};

export default function MaintenanceLayout() {
  return (
    <html lang="en">
      <body>
        <BackendErrorPage />
      </body>
    </html>
  );
}
