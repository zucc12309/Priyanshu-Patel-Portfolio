import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { RouteTransitions } from "@/components/site/route-transitions";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://priyanshupatel.dev"),
  title: {
    default: "Priyanshu Patel — Business Analyst & AI Product Builder",
    template: "%s | Priyanshu Patel",
  },
  description:
    "Business Analyst at Digit Life Insurance supporting a ₹1,500+ Cr premium portfolio — and an AI product builder: Memory Router, LifePilot, RideCompare and more.",
  openGraph: {
    title: "Priyanshu Patel — Business Analyst & AI Product Builder",
    description: "Business Analyst at Digit Life Insurance. Builds AI products: Memory Router, LifePilot, RideCompare. Tech Titan Award recipient.",
    type: "website",
    images: ["/projects/memory-router.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Patel — Business Analyst & AI Product Builder",
    description: "Business Analyst at Digit Life Insurance. Builds AI products.",
    images: ["/projects/memory-router.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#EEEAE2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} font-sans antialiased`}>
        {children}
        <RouteTransitions />
        <Analytics />
      </body>
    </html>
  );
}
