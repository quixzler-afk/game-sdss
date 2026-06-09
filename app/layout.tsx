import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameFinder",
  description:
    "SPK Rekomendasi Game menggunakan metode AHP dan TOPSIS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`
          ${inter.className}
          bg-[#0B1020]
          text-[#E6EDF3]
          min-h-screen
        `}
      >
        {children}
      </body>
    </html>
  );
}