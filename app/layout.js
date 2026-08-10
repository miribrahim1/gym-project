import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/db/settings";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
