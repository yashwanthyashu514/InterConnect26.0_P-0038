import React from "react";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/shared/GlobalNav";
import Script from "next/script";

export const metadata: Metadata = {
  title: "maCA Empire — The Future of Indian Legal & Financial Intelligence",
  description:
    "Big 4 quality consulting at consumer scale. 19 autonomous AI agents for tax, compliance, legal disputes, and financial matters. From just ₹1,499/month.",
  keywords: [
    "Indian legal AI",
    "GST compliance",
    "Income Tax agent",
    "RBI escalation",
    "maCA Empire",
    "legal tech India",
    "CA AI",
  ],
  openGraph: {
    title: "maCA Empire — AI-Powered Legal & Financial Intelligence",
    description:
      "15 autonomous AI agents for tax, compliance, legal disputes. India-first. DPDP Compliant.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable}`} suppressHydrationWarning>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
