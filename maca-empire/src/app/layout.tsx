import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import GlobalNav from "@/components/shared/GlobalNav";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "maCA Empire — The Future of Indian Legal & Financial Intelligence",
  description:
    "Big 4 quality consulting at consumer scale. 15 autonomous AI agents for tax, compliance, legal disputes, and financial matters. From just ₹1,499/month.",
  keywords: [
    "Indian legal AI",
    "GST compliance",
    "Income Tax agent",
    "RBI escalation",
    "maCA Empire",
    "legal tech India",
    "CA AI",
  ],
  // ── Responsive viewport — prevents mobile zoom-out ──
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  // ── Native feel on Android Chrome ──
  themeColor: "#000000",
  openGraph: {
    title: "maCA Empire — AI-Powered Legal & Financial Intelligence",
    description:
      "15 autonomous AI agents for tax, compliance, legal disputes. India-first. DPDP Compliant.",
    type: "website",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
