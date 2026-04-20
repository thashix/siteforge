import type { Metadata } from "next";
import { DM_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SiteForge — Générez un site pro en 30 secondes",
  description:
    "Décrivez votre activité, obtenez un site professionnel, moderne et animé. Propulsé par l'IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[var(--sf-app-bg)] text-[var(--sf-app-text)]">
        {children}
      </body>
    </html>
  );
}
