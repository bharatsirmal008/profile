import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/amarna";
import "@fontsource/amarna/700.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bharatsirmal.vercel.app"),
  applicationName: "Bharat Sirmal",
  creator: "Bharat Sirmal",
  publisher: "Bharat Sirmal",
  icons: { shortcut: "/favicon.ico" },
  title: {
    default: "Bharat Sirmal - Software Engineer | Full-Stack Developer | AI/ML Developer",
    template: "%s | Bharat Sirmal",
  },
  description: "Bharat Sirmal is a full-stack developer and AI/ML enthusiast. Explore his React, Next.js and Python projects, skills, resume and JOJO AI assistant.",
  authors: [{ name: "Bharat Sirmal", url: "https://bharatsirmal.vercel.app" }],
  openGraph: {
    url: "https://bharatsirmal.vercel.app/",
    type: "website",
    locale: "en_US",
    siteName: "Bharat Sirmal",
    title: "Bharat Sirmal - Software Engineer | Full-Stack Developer | AI/ML Developer",
    description: "Explore Bharat Sirmal's projects, skills, education and resume, and meet JOJO, his personal AI assistant.",
    images: [{ url: "/profile_image.png", alt: "Bharat Sirmal" }],
  },
  twitter: {
    card: "summary",
    title: "Bharat Sirmal - Software Engineer | Full-Stack Developer | AI/ML Developer",
    description: "Full-stack development projects, skills, education and resume by Bharat Sirmal.",
    images: ["/profile_image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground tracking-tight">
        {children}
      </body>
    </html>
  );
}
