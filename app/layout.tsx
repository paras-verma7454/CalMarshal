import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Analytics } from "@vercel/analytics/react"
import  image  from "@/public/image.png"


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CalMarshal",
  description: "CalMarshal – A modern scheduling platform with seamless booking, real-time availability, and calendar integration.",
  openGraph: {
    title: "CalMarshal",
    description: "A Calendar Scheduling Platform",
    url: "https://cal-marshal-phi.vercel.app",
    type: "website",
    images: [
      {
        url: "/image.png",
        width: 800,
        height: 600,
        alt: "CalMarshal ",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}/>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
