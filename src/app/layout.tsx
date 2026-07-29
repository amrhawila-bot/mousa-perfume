import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOUSA | العطور الفاخرة",
  description:
    "اكتشف جوهر الفخامة الحقيقية. عطور مصنوعة يدوياً للروح المميزة. تشكيلة حصرية من أفخر العطور الشرقية والغربية.",
  keywords: [
    "عطور",
    "فخامة",
    "MOUSA",
    "موسى",
    "عطور فرنسية",
    "عطور شرقية",
    "عطور رجالية",
    "عطور حريمي",
    "دهن عود",
    "perfume",
    "luxury perfume",
  ],
  authors: [{ name: "MOUSA Parfum" }],
  openGraph: {
    title: "MOUSA | العطور الفاخرة",
    description:
      "اكتشف جوهر الفخامة الحقيقية. عطور مصنوعة يدوياً للروح المميزة.",
    type: "website",
    locale: "ar_SA",
    siteName: "MOUSA Parfum",
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
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="min-h-full">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f0e8",
              border: "1px solid rgba(212,175,55,0.2)",
              fontFamily: "var(--font-cairo)",
            },
          }}
        />
      </body>
    </html>
  );
}
