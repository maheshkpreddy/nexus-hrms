import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ApiProvider } from "@/lib/api-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS HRMS - AI-Powered Enterprise HR Platform",
  description: "Enterprise Multi-Company AI-Driven Human Resource Management System with intelligent workflows, predictive analytics, and comprehensive HR automation.",
  keywords: ["HRMS", "HR", "Enterprise", "AI", "Human Resources", "Payroll", "Recruitment"],
  authors: [{ name: "NEXUS HRMS" }],
  openGraph: {
    title: "NEXUS HRMS",
    description: "AI-Powered Enterprise HR Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ErrorBoundary>
          <ApiProvider>
            {children}
          </ApiProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
