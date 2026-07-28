import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://scalar-design-library.sites.openai.com"),
  title: "Scalar — Real-world design inspiration",
  description: "Discover real-world product design patterns, screens, and complete user flows with Scalar.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Scalar — Real-world design inspiration",
    description: "The world's design library. Explore apps, screens, and complete user flows.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 864, alt: "Scalar — Discover real-world design inspiration." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scalar — Real-world design inspiration",
    description: "The world's design library. Explore apps, screens, and complete user flows.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={geist.variable}>{children}</body></html>;
}
