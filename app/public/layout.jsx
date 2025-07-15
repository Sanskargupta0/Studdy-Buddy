"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogIn, UserPlus, Github, Moon, Sun, LayoutDashboard, Store } from "lucide-react";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MarketLayout({ children }) {
  const { isSignedIn } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Memoized theme toggle function with animation
  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);

    // Add animation class to body
    document.body.classList.add("theme-transition");
    setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 300);
  }, [isDark, setTheme]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="nav-glass fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={isSignedIn?'/dashboard':"/"}>
              <div className="flex-shrink-0 flex items-center">
                <Image
                  src={"/logo.svg"}
                  alt="logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto dark:invert dark:brightness-0 dark:contrast-100 transition-all duration-300"
                />
                <span className="ml-2 text-xl font-bold text-foreground">
                  StuddyBuddy
                </span>
              </div>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={cn(
                        "theme-toggle rounded-full hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "transition-all duration-200 hover:scale-105 active:scale-95",
                        "relative overflow-hidden group"
                      )}
                      aria-label={
                        isDark ? "Switch to light mode" : "Switch to dark mode"
                      }
                    >
                      <span className="relative z-10">
                        {isDark ? (
                          <Sun className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Moon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100",
                          "transition-opacity duration-300"
                        )}
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-sm">
                    {isDark ? "Switch to light mode" : "Switch to dark mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <a
                href="https://github.com/Sanskargupta0/Studdy-Buddy"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-button inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
              {!isSignedIn ? (
                <div className="flex space-x-3">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="nav-button inline-flex items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="nav-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 shadow-md hover:shadow-lg">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <button className="nav-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 shadow-md hover:shadow-lg">
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/dashboard/marketplace">
                    <button className="nav-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200">
                      MarketPlace
                    </button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center gap-2 sm:hidden">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={cn(
                        "theme-toggle rounded-full hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "transition-all duration-200 hover:scale-105 active:scale-95",
                        "relative overflow-hidden group"
                      )}
                      aria-label={
                        isDark ? "Switch to light mode" : "Switch to dark mode"
                      }
                    >
                      <span className="relative z-10">
                        {isDark ? (
                          <Sun className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Moon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100",
                          "transition-opacity duration-300"
                        )}
                        aria-hidden="true"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-sm">
                    {isDark ? "Switch to light mode" : "Switch to dark mode"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isSignedIn && <UserButton afterSignOutUrl="/" />}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring transition-colors duration-200"
                aria-expanded="false"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
          {!isSignedIn ? (
            <div className="pt-2 pb-3 space-y-1 mobile-menu-backdrop border-t border-border flex flex-col">
              <div className="flex items-center px-4 space-x-3">
                <a
                  href="https://github.com/Sanskargupta0/Studdy-Buddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-button w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  <Github className="h-4 w-4 mr-2" />
                  <span>GitHub</span>
                </a>
              </div>
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-4 space-x-3">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="nav-button inline-flex w-full justify-center items-center px-4 py-2 border border-border text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="nav-button inline-flex w-full justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all duration-200 shadow-md hover:shadow-lg">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-2 pb-3 space-y-1 mobile-menu-backdrop border-t border-border flex flex-col">
              <div className="flex items-center px-4 space-x-3">
                <a
                  href="https://github.com/Sanskargupta0/Studdy-Buddy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-button w-full flex items-center justify-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                >
                  <Github className="h-4 w-4 mr-2" />
                  <span>GitHub</span>
                </a>
              </div>
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-4 space-x-3">
                  <Link href="/dashboard" className="w-full">
                    <button className="nav-button w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg">
                       <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </button>
                  </Link>
                  <Link href="/dashboard/marketplace" className="w-full">
                    <button className="nav-button w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200">
                     <Store className="h-4 w-4 mr-2" />
                      Marketplace
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-6 pt-20">{children}</main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Studdy Buddy. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <a
                  href="https://github.com/Sanskargupta0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sanskar Gupta
                </a>
              </p>
        </div>
      </footer>
    </div>
  );
}
