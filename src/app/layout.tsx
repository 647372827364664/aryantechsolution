import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aryan Tech Solution - Premium Hosting & Tech Services",
  description: "Premium hosting & tech solutions for the next generation. VPS hosting, domain registration, bot development, and custom solutions.",
  keywords: "hosting, VPS, domains, web development, bot development, tech solutions, aryan tech",
  authors: [{ name: "Aryan Thakur" }],
  creator: "Aryan Tech Solution",
  openGraph: {
    title: "Aryan Tech Solution - Premium Hosting & Tech Services",
    description: "Premium hosting & tech solutions for the next generation.",
    type: "website",
    locale: "en_IN",
    siteName: "Aryan Tech Solution",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan Tech Solution - Premium Hosting & Tech Services",
    description: "Premium hosting & tech solutions for the next generation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#4F46E5',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
