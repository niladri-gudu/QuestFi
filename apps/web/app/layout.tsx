import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

import "dotenv/config";
import Navbar from "../components/layout/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuestFi",
  description: "Consumer dApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
