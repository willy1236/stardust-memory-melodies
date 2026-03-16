import type { Metadata } from "next";
import { Inter, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: "回憶計畫：星塵回憶曲 | Project Memories",
  description:
    "A digital memory bank to permanently archive interactions, events, and moments among group members.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className="dark">
      <body
        className={`${inter.variable} ${notoSansTC.variable} font-display bg-black text-slate-100 antialiased overflow-x-hidden min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
