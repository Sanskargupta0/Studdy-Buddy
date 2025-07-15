"use client";

import React, { useCallback } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  Sparkles,
  Github,
  Menu,
  X,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  LayoutDashboard,
  Store,
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

const LandingPage = () => {
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
              <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                <a
                  href="#features"
                  className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#testimonials"
                  className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Testimonials
                </a>
              </div>
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
            <a
              href="#features"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            >
              Testimonials
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {!isSignedIn ? (
                <div className="flex flex-col items-center px-4 space-x-3">
                  <a
                    href="https://github.com/yourusername/studdy-buddy"
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
                    href="https://github.com/yourusername/studdy-buddy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    <span>GitHub</span>
                  </a>
                  <div className="flex items-center px-4 mt-4 space-x-3 w-full">
                    <Link href="/dashboard" className="w-full">
                      <button className="inline-flex items-center justify-center px-4 py-2 w-full  border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
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
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                  Create Perfect Study Materials
                  <span className="text-purple-600 dark:text-purple-400 block">
                    In Seconds
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Just type your content, select difficulty level, and let our
                  AI create personalized study materials to boost your learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Creating Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline">
                      Try for Free
                    </Button>
                  </Link>
                </div>
                <div className="pt-4 text-sm text-gray-500 dark:text-gray-400">
                  No credit card required • Start learning effectively today
                </div>
              </div>
              <div className="flex-1 relative max-w-lg mx-auto lg:max-w-none">
                <div className="relative w-full h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src="/image.png"
                    alt="AI Study Material Generator Dashboard"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-yellow-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      AI-generated in seconds!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Revolutionize Your Learning Experience
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our cutting-edge AI technology creates personalized study
                materials that adapt to your learning style.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Personalized Learning",
                  description:
                    "AI analyzes your learning style and creates materials tailored specifically to you.",
                },
                {
                  icon: (
                    <FileText className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Multiple Formats",
                  description:
                    "Generate flashcards, summaries, practice tests, and more with a single click.",
                },
                {
                  icon: (
                    <BookOpen className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Any Subject",
                  description:
                    "From mathematics to literature, our AI handles any subject with expert precision.",
                },
                {
                  icon: (
                    <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Time-Saving",
                  description:
                    "Create weeks worth of study materials in minutes, not hours.",
                },
                {
                  icon: (
                    <ArrowRight className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Progress Tracking",
                  description:
                    "Monitor your learning journey with detailed analytics and insights.",
                },
                {
                  icon: (
                    <Sparkles className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  ),
                  title: "Continuous Improvement",
                  description:
                    "Our AI learns from your feedback to create better materials over time.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Create your perfect study materials in just three easy steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Your Content",
                  description:
                    "Type or paste your study material, notes, or any text you want to learn from.",
                },
                {
                  step: "02",
                  title: "Set Difficulty Level",
                  description:
                    "Choose the complexity level that matches your current understanding.",
                },
                {
                  step: "03",
                  title: "Generate & Learn",
                  description:
                    "Get instant, personalized study materials optimized for your needs.",
                },
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md h-full">
                    <div className="text-5xl font-bold text-purple-200 dark:text-purple-800 mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-purple-300 dark:text-purple-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Join thousands of students and educators who have transformed
                their learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "StuddyBuddy helped me ace my finals. The personalized flashcards were exactly what I needed!",
                  name: "Sarah Johnson",
                  role: "Medical Student",
                },
                {
                  quote:
                    "As a teacher, this tool has saved me countless hours preparing study materials for my students.",
                  name: "Michael Chen",
                  role: "High School Teacher",
                },
                {
                  quote:
                    "The practice tests generated by StuddyBuddy perfectly matched my learning style. Highly recommend!",
                  name: "Emma Rodriguez",
                  role: "Computer Science Major",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-6 text-purple-600 dark:text-purple-400">
                      {"★".repeat(5)}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic mb-6 flex-grow">
                      "{testimonial.quote}"
                    </p>
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-600 dark:bg-purple-700">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Study Smarter?
            </h2>
            <p className="text-xl text-purple-100 dark:text-purple-200 mb-8 max-w-3xl mx-auto">
              Join students who are already learning more effectively with
              AI-generated study materials.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-purple-700 dark:hover:bg-gray-200"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-4 text-purple-200 dark:text-purple-300 text-sm">
              No credit card required • Start for free
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 py-4  sm:px-6 lg:px-8">
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

export default LandingPage;
