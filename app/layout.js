import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MemoizedAppProvider } from "./_context/AppContext";
import StructuredData from "@/components/StructuredData";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: false, // Prevent layout shift if font fails to load
});

// Metadata for the application
export const metadata = {
  title: {
    default: "StuddyBuddy - AI-Powered Study Material Generator",
    template: "%s | StuddyBuddy"
  },
  description: "Create personalized study materials with AI. Generate flashcards, notes, quizzes, and Q&A sessions in minutes. Boost your learning with StuddyBuddy's cutting-edge AI technology.",
  keywords: ["AI study materials", "flashcards", "quiz generator", "study notes", "personalized learning", "education technology", "AI tutor"],
  authors: [{ name: "StuddyBuddy Team" }],
  creator: "StuddyBuddy",
  publisher: "StuddyBuddy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.HOST_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'StuddyBuddy - AI-Powered Study Material Generator',
    description: 'Create personalized study materials with AI. Generate flashcards, notes, quizzes, and Q&A sessions in minutes.',
    siteName: 'StuddyBuddy',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'StuddyBuddy - AI Study Material Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StuddyBuddy - AI-Powered Study Material Generator',
    description: 'Create personalized study materials with AI. Generate flashcards, notes, quizzes, and Q&A sessions in minutes.',
    images: ['/api/og'],
    creator: '@StuddyBuddy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/logo.svg',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Memoized layout component for better performance
export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: outfit.className }} dynamic={true}>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Additional meta tags for better SEO */}
          <meta name="application-name" content="StuddyBuddy" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="StuddyBuddy" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-tap-highlight" content="no" />
          
          {/* Preconnect to external domains for performance */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body className={outfit.className}>
          <StructuredData />
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
