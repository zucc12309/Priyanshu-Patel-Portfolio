import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/background";
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
  metadataBase: new URL("https://priyanshupatel.dev"),
  title: {
    default: "Priyanshu Patel — Business Analyst & AI Product Builder",
    template: "%s | Priyanshu Patel",
  },
  description:
    "Business Analyst at Digit Insurance, building AI products and transitioning to Product Management. Portfolio featuring Memory Router, RideCompare, and more.",
  openGraph: {
    title: "Priyanshu Patel — Business Analyst & AI Product Builder",
    description: "Business Analyst at Digit Insurance. Building AI products, targeting PM roles. Tech Titan Award recipient.",
    type: "website",
    images: ["/projects/memory-router.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Patel — Business Analyst & AI Product Builder",
    description: "Business Analyst at Digit Insurance. Building AI products, targeting PM roles.",
    images: ["/projects/memory-router.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <AmbientBackground />
        {children}
      </body>
    </html>
  );
}
