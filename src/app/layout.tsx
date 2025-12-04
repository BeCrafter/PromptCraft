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

export const metadata: Metadata = {
  title: {
    default: "PromptCraft - 提示词工坊 | AI Prompt Collection",
    template: "%s | PromptCraft"
  },
  description: "PromptCraft（提示词工坊）是一个精心策划的AI提示词集合平台，提供高质量的编程、写作和AI生成提示词。专业制作，生产就绪。",
  keywords: ["AI提示词", "Prompt", "AI工具", "ChatGPT提示词", "编程提示词", "写作提示词", "PromptCraft", "提示词工坊"],
  authors: [{ name: "PromptCraft Team" }],
  creator: "PromptCraft",
  publisher: "PromptCraft",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://promptcraft.ai",
    siteName: "PromptCraft",
    title: "PromptCraft - 提示词工坊 | AI Prompt Collection",
    description: "精心策划的AI提示词集合平台，提供高质量的编程、写作和AI生成提示词",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PromptCraft - 提示词工坊",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptCraft - 提示词工坊 | AI Prompt Collection",
    description: "精心策划的AI提示词集合平台，提供高质量的编程、写作和AI生成提示词",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // 可以添加 Google Search Console 验证码
    // google: "your-google-verification-code",
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
      </body>
    </html>
  );
}
