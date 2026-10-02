import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Experience } from "@/components/site/experience";
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

// Before first paint: play the intro once per visit on the home page (never with
// reduced motion), with a failsafe that always reveals the page.
const preIntro = `try{var d=document.documentElement;if(location.pathname==='/'&&!sessionStorage.getItem('pp-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='1';setTimeout(function(){delete d.dataset.intro},3000)}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preIntro }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} font-sans antialiased`}>
        {children}
        <Experience />
        <Analytics />
      </body>
    </html>
  );
}
