import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AquaTrack - Water Usage Tracking & Conservation",
  description: "Monitor water usage, conserve resources, and connect with certified plumbers. AquaTrack empowers communities to make every drop count.",
  keywords: "water tracking, conservation, sustainability, plumber, leak reporting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
