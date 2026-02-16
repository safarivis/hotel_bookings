import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentix Travel | AI-Powered Hotel Booking",
  description: "Search and compare over 2 million hotels worldwide. AI-powered recommendations, best prices, and instant booking.",
  keywords: ["hotels", "booking", "travel", "AI", "accommodation"],
  openGraph: {
    title: "Agentix Travel | AI-Powered Hotel Booking",
    description: "Search and compare over 2 million hotels worldwide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
