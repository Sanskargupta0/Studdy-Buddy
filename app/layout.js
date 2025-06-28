"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MemoizedAppProvider } from "./_context/AppContext";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

// Memoized layout component for better performance
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: outfit.className }} dynamic={true}>
      <html lang="en" suppressHydrationWarning>
        <body className={outfit.className}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange // Reduce layout shift
          >
            <MemoizedAppProvider>
              {children}
              <Toaster position="top-center" richColors closeButton />
            </MemoizedAppProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
