import type { Metadata } from "next";
import "../styles/globals.css";
import GoogleAnalytics from "./Privatefiles/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Latur Hostel",
  description: "Generated by Dossifoyer",
  icons: {
    icon: [
      {
        url: "/logo/logowhite.svg",
        href: "/logo/logowhite.svg",
        type: "image/svg+xml",
        sizes: "32x32 48x48 96x96 128x128 256x256",
      },
    ],
    shortcut: [
      {
        url: "/logo/logowhite.svg",
        type: "image/svg+xml",
        sizes: "128x128",
      },
    ],
    apple: [
      {
        url: "/logo/logowhite.svg",
        type: "image/svg+xml",
        sizes: "180x180", // Standard Apple touch icon size
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Latur Hostel",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        {/* Larger favicon sizes */}
        <link
          rel="icon"
          href="/logo/logowhite.svg"
          type="image/svg+xml"
          sizes="any"
        />
        <link
          rel="shortcut icon"
          href="/logo/logowhite.svg"
          type="image/svg+xml"
          sizes="128x128"
        />
        <link
          rel="apple-touch-icon"
          href="/logo/logowhite.svg"
          type="image/svg+xml"
          sizes="180x180"
        />

        {/* Additional larger favicon options */}
        <link
          rel="icon"
          href="/logo/logowhite.svg"
          sizes="32x32"
          type="image/svg+xml"
        />
        <link
          rel="icon"
          href="/logo/logowhite.svg"
          sizes="48x48"
          type="image/svg+xml"
        />
        <link
          rel="icon"
          href="/logo/logowhite.svg"
          sizes="96x96"
          type="image/svg+xml"
        />
        <link
          rel="icon"
          href="/logo/logowhite.svg"
          sizes="144x144"
          type="image/svg+xml"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
