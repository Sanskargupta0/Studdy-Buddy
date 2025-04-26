"use client";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Outfit } from "next/font/google";
import Provider, { useZenMode } from "./provider";
import { Toaster } from "@/components/ui/sonner";



const outfit = Outfit({
  subsets: ["latin"],
});

// Wrapper component to apply zen mode
function AppContent({ children }) {
  const { zenMode } = useZenMode();
  
  return (
    <div className={`${zenMode ? 'zen-mode' : ''}`}>
      {children}
    </div>
  );
}

// Change to client component to support zen mode
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: outfit.className }} dynamic={true}>
      <html lang="en">
        <body className={outfit.className}>
          <Provider>
            <AppContent>{children}</AppContent>
            <Toaster />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
