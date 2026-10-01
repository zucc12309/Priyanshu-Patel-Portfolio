import { Press_Start_2P, VT323 } from "next/font/google";
import { AmbientBackground } from "@/components/background";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt",
  display: "swap",
});

export default function RetroLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${pixel.variable} ${vt.variable} min-h-screen bg-[#0B0F14] text-[#F5F1E8] [color-scheme:dark]`}>
      <AmbientBackground />
      {children}
    </div>
  );
}
