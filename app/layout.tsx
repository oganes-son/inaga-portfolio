import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { seoData } from "@/lib/works";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://inagainaga.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  // タイトル・説明文: data/works.json の seoData から読み込み
  title: {
    default: seoData.title,
    template: "%s | いなが",
  },
  description: seoData.description,

  // キーワード: 検索エンジンへのヒント（過剰にならないよう厳選）
  keywords: ["いなが", "いなが 音楽", "INAGA", "音楽クリエイター", "楽曲制作", "グラフィックデザイン", "ポートフォリオ", "札幌", "北海道大学", "Purify", "Paradigm Shift"],

  // canonical URL: 正規URLをGoogleに伝える
  alternates: {
    canonical: BASE_URL,
  },

  // OGP: SNSシェア時のカード表示
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "いなが Portfolio",
    locale: "ja_JP",
    title: seoData.title,
    description: seoData.description,
    images: [
      {
        url: "/images/top_logo.png",
        width: 1200,
        height: 630,
        alt: "いなが Portfolio",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@inaga_P",
    title: seoData.title,
    description: seoData.description,
    images: ["/images/top_logo.png"],
  },

  // クロール設定
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // Google Search Console 認証コード
  verification: {
    google: "C8Z_zfa1YbOqMXeAbiiHU8f3qzEUHG_xqWbPjQwgLhE",
  },

  icons: {
    icon: "/images/favicon.ico",
  },
};

// JSON-LD 構造化データ: Googleに「いなが＝音楽クリエイター」と明示する
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "いなが",
  alternateName: "INAGA",
  url: BASE_URL,
  description: "札幌を拠点に活動する音楽クリエイター・グラフィックデザイナー。",
  jobTitle: "音楽クリエイター / グラフィックデザイナー",
  sameAs: [
    "https://x.com/inaga_P",
    "https://soundcloud.com/sgextgl4iyy9",
    "https://www.youtube.com/channel/UCqKZxqgCvRkReqnejZIMydQ",
    "https://www.instagram.com/inaga__inaga",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}