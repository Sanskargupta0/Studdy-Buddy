"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "./_context/AppContext";

const outfit = Outfit({
  subsets: ["latin"],
});

// Change to client component to support zen mode
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: outfit.className }} dynamic={true}>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppProvider>
              {children}
              <Toaster />
            </AppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
