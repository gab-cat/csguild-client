import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/lib/providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CS Guild | At the intersection of technology and education",
  description: "CS Guild is a community of Computer Science students who are passionate about building and learning together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // @ts-expect-error - webcrx is not a valid attribute for html
    <html lang="en" webcrx=''>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased font-space-grotesk bg-gray-950 text-white `}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
