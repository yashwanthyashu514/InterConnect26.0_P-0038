import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "maCA Empire | AI-Powered Legal & Financial Intelligence",
  description: "The first-mover platform for RB-IOS 2026, GST, Income Tax, and Compliance automation. Fast, accurate, and ready for the future of Indian regulation.",
  keywords: ["RB-IOS 2026", "GST AI", "Income Tax Agent", "Banking Ombudsman", "Compliance Automation", "maCA Empire"],
};

import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
