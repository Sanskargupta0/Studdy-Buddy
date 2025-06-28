"use client";
import { memo, useCallback, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Dynamically import heavy components
const SideBar = dynamic(() => import('./SideBar'), { ssr: false });
const DashboardHeader = dynamic(() => import('./DashboardHeader'), { ssr: false });

function DashboardLayoutClient({ children }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Memoize the toggle function
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!mounted || !isLoaded || !user) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center bg-background"
        role="status"
        aria-label="Loading dashboard"
      >
        <div 
          className="h-10 w-10 border-4 border-primary/20 rounded-full border-t-primary animate-spin"
          aria-hidden="true"
        >
          <span className="sr-only">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar for desktop */}
      <aside 
        className="hidden md:block fixed z-30 h-full w-64 border-r border-border bg-background/95 backdrop-blur-sm"
        aria-label="Main navigation"
      >
        <SideBar />
      </aside>
      
      {/* Sidebar drawer for mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 md:hidden ${
          sidebarOpen 
            ? 'opacity-100 visible' 
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!sidebarOpen}
      >
        <div 
          className={`fixed left-0 top-0 h-full w-72 bg-background/95 backdrop-blur-sm shadow-xl border-r border-border transition-all duration-300 ease-in-out transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <SideBar closeSidebar={() => setSidebarOpen(false)} />
        </div>
      </div>
      
      <div className="md:ml-64 min-h-screen flex flex-col transition-spacing duration-200">
        <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
          <DashboardHeader onBurgerClick={toggleSidebar} />
        </header>
        
        <main 
          id="main-content"
          className="flex-1 p-4 sm:p-6 bg-background transition-colors duration-200"
          tabIndex="-1"
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
        
        <footer className="border-t border-border bg-background/50 py-4 px-6 text-center text-sm text-muted-foreground">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© {new Date().getFullYear()} Studdy Buddy. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default memo(DashboardLayoutClient);