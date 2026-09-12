import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zivora.app"),
  title: "Zivora — A little closer to your people",
  description: "Find your people on Zivora. India-first dating, genuine friendships, interest communities, local events, and safer real-world connections. An adult-only space for meaningful connection.",
  applicationName: "Zivora",
  keywords: ["Zivora", "NearU", "India dating", "Bengaluru communities", "friendship", "local meetups", "safe connections"],
  openGraph: { title: "Zivora — Find your people. Make it real.", description: "For a spark, a friendship, or a shared adventure. India’s connection space for adults 18+.", type: "website", locale: "en_IN", images: [{ url: "/images/member-avatar.svg", width: 512, height: 512, alt: "Zivora member avatar" }] },
  twitter: { card: "summary_large_image", title: "Zivora — A little closer to real", description: "Real people. Meaningful connections. Made for India.", images: ["/images/member-avatar.svg"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
