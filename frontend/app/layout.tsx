import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const marianne = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/Marianne-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Marianne-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Marianne-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Marianne-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenScience Hub — Répertoire institutionnel de science ouverte",
  description:
    "Plateforme institutionnelle pour déposer, valider, archiver et explorer mémoires, thèses et articles scientifiques. Extraction IA des métadonnées, recherche à facettes et preuves d'authenticité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${marianne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
