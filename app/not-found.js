"use client";

import React, { useCallback } from "react";
import {
  ArrowRight,
  Home,
  Search,
  BookOpen,
  Github,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  LayoutDashboard,
  Store,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href={isSignedIn ? "/dashboard" : "/"}>
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
              {/* Theme Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={cn(
                        "rounded-full hover:bg-accent hover:text-accent-foreground",
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
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
              >
                <Github className="h-4 w-4 mr-2" />
                <span>GitHub</span>
              </a>
              {!isSignedIn ? (
                <div className="flex space-x-3">
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/dashboard">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                      Dashboard
                    </button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
            <div className="-mr-2 flex items-center gap-2 sm:hidden">
              {/* Theme Toggle */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={cn(
                        "rounded-full hover:bg-accent hover:text-accent-foreground",
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
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
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
          <div className="pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {!isSignedIn ? (
                <div className="flex flex-col items-center px-4 space-x-3">
                  <a
                    href="https://github.com/Sanskargupta0/Studdy-Buddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span>GitHub</span>
                  </a>
                  <div className="flex items-center px-4 mt-4 space-x-3 w-full">
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                      <button className="inline-flex items-center px-4 py-2 w-full border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                        <LogIn className="h-4 w-4 mr-2" />
                        Log In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                      <button className="inline-flex items-center px-4 py-2 w-full border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center px-4 space-x-3">
                  <a
                    href="https://github.com/Sanskargupta0/Studdy-Buddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span>GitHub</span>
                  </a>
                  <div className="flex items-center px-4 mt-4 space-x-3 w-full">
                    <Link href="/dashboard" className="w-full">
                      <button className="inline-flex items-center justify-center px-4 py-2 w-full border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </button>
                    </Link>
                    <Link href="/dashboard/marketplace" className="w-full">
                      <button className="inline-flex items-center px-4 py-2 justify-center w-full border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                        <Store className="h-4 w-4 mr-2" />
                        Marketplace
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col pt-16">
        {/* 404 Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8 flex-grow flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center">
              <div className="mb-8">
                <AlertTriangle className="h-24 w-24 text-purple-600 dark:text-purple-400 mx-auto mb-6" />
                <h1 className="text-8xl md:text-9xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                  404
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Oops! Page Not Found
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                  It looks like the page you're looking for doesn't exist. It
                  might have been moved, deleted, or you entered the wrong URL.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Back Home
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>

              {/* Helpful Links */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Link href="/dashboard" className="group">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                    <LayoutDashboard className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Access your study materials and create new courses
                    </p>
                  </div>
                </Link>

                <Link href="/dashboard/marketplace" className="group">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                    <Store className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Marketplace
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Explore shared courses from other users
                    </p>
                  </div>
                </Link>

                <Link href="/#features" className="group">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
                    <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Features
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Learn about our AI-powered study tools
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="border-gray-800 dark:border-gray-700 text-sm text-center text-gray-400 dark:text-gray-500 space-y-2">
              <p>
                {new Date().getFullYear()} StuddyBuddy. All rights reserved.
              </p>
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
          </div>
        </footer>
      </main>
    </div>
  );
};

export default NotFound;
