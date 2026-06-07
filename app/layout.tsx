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
    default: "Priyanshu Patel | Business Analyst · Product & Data Systems",
    template: "%s | Priyanshu Patel",
  },
  description:
    "I am Priyanshu Patel, a product and data-focused Business Analyst working across requirements, API-driven systems, SQL analysis, workflow automation, UAT, and AI product prototypes.",
  openGraph: {
    title: "Priyanshu Patel | Business Analyst · Product & Data Systems",
    description: "I work across requirements, API-driven workflows, data analysis, UAT, automation, and AI product prototypes.",
    type: "website",
    images: ["/projects/lifeadmin-os.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priyanshu Patel | Business Analyst · Product & Data Systems",
    description: "I am a product and data-focused Business Analyst.",
    images: ["/projects/lifeadmin-os.png"],
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
