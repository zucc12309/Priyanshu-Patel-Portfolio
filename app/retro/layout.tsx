import { Press_Start_2P, VT323 } from "next/font/google";

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
    <div className={`${pixel.variable} ${vt.variable}`}>
      {children}
    </div>
  );
}
