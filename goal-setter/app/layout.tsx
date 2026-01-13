import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoalSetterProvider } from "@/lib/context/GoalSetterContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://goals.manofwisdom.co"),
  title: "Man of Wisdom - Set Your 2026 Goals",
  description: "Plan your 2026 in 5 minutes and unlock your free journal",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Set Your 2026 Goals in 5 Minutes",
    description: "Plan your year and get 1 month FREE access to Man of Wisdom Digital Journal",
    url: "https://goals.manofwisdom.co",
    siteName: "Man of Wisdom",
    images: [
      {
        url: "https://goals.manofwisdom.co/og-image.png",
        width: 1200,
        height: 630,
        alt: "Set Your 2026 Goals - Man of Wisdom",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Set Your 2026 Goals in 5 Minutes",
    description: "Plan your year and get 1 month FREE access to Man of Wisdom Digital Journal",
    images: ["https://goals.manofwisdom.co/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoalSetterProvider>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full py-6 px-4 border-t border-gray-800 bg-black/50">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <p>
                Part of{" "}
                <a
                  href="https://manofwisdom.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Man of Wisdom
                </a>
              </p>
              <p>&copy; {new Date().getFullYear()} Man of Wisdom. All rights reserved.</p>
            </div>
          </footer>
        </GoalSetterProvider>
      </body>
    </html>
  );
}
