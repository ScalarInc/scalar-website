import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Scalar — Built for What's Next",
  description:
    "Scalar is an AI engineering partner for teams shipping real products. We design, build and operate LLM applications, agents and the data infrastructure underneath them.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Scalar — Built for What's Next",
    description:
      "AI systems, engineered for production. An engineering partner that ships LLM applications, agents, and the data infrastructure underneath.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scalar — Built for What's Next",
    description: "AI systems, engineered for production.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
