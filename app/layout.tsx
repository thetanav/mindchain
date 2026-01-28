import type React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mindchain",
  description:
    "Secure, anonymous mental health support powered by blockchain technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} ${serif.variable} font-sans antialiased min-h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <ConvexClientProvider>
              <NextTopLoader color="#2563eb" showSpinner={false} />
              {children}
            </ConvexClientProvider>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
