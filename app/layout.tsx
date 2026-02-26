import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//ページタブ説明文
export const metadata: Metadata = {
  title: {
    default: "いなが (INAGA) | Portfolio of music / graphic design",
    template: "%s | inaga", 
  },
  description: "札幌を拠点に活動するクリエイター「いなが」の公式サイト。楽曲制作（Purify, Paradigm Shift）やグラフィックデザインなどを掲載しています。",
  keywords: ["いなが", "INAGA", "音楽", "デザイン", "北海道大学", "ポートフォリオ", "Purify", "北大"],
  verification: {
    google: "C8Z_zfa1YbOqMXeAbiiHU8f3qzEUHG_xqWbPjQwgLhE",
  },
  icons: {
    icon: "/images/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}