import localFont from "next/font/local";
import "./globals.css";
import { getSettings } from "@/lib/db/settings";

const bebas = localFont({
  src: "./fonts/bebas-neue-400.ttf", variable: "--font-bebas", weight: "400", display: "swap",
});
const inter = localFont({
  src: [
    { path: "./fonts/inter-100.ttf", weight: "100", style: "normal" },
    { path: "./fonts/inter-200.ttf", weight: "200", style: "normal" },
    { path: "./fonts/inter-300.ttf", weight: "300", style: "normal" },
    { path: "./fonts/inter-400.ttf", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.ttf", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.ttf", weight: "600", style: "normal" },
    { path: "./fonts/inter-700.ttf", weight: "700", style: "normal" },
    { path: "./fonts/inter-800.ttf", weight: "800", style: "normal" },
    { path: "./fonts/inter-900.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-inter", display: "swap",
});

export const dynamic = "force-dynamic";

const siteUrl = "https://www.ironvaultfitness.com";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.gymName} | Premium Strength & Fitness Club`,
      template: `%s | ${settings.gymName}`,
    },
    description:
      "IronVault Fitness is a premium strength and fitness club offering elite personal training, group classes, nutrition coaching and a supportive high-performance community.",
    keywords: [
      "gym",
      "fitness club",
      "personal training",
      "strength training",
      "IronVault Fitness",
      "nutrition coaching",
      "group fitness classes",
    ],
    openGraph: {
      title: `${settings.gymName} | Premium Strength & Fitness Club`,
      description: settings.tagline,
      url: siteUrl,
      siteName: settings.gymName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.gymName} | Premium Strength & Fitness Club`,
      description: settings.tagline,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ink-950 text-bone-100 bg-noise">
        {children}
      </body>
    </html>
  );
}
