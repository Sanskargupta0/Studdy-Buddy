"use client";

import { useUser } from "@clerk/nextjs";
import { GraduationCap, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function WelcomeBanner() {
  const { user, isLoaded } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("");

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !user) {
    return (
      <div
        className="w-full h-32 bg-muted/30 rounded-2xl animate-pulse"
        aria-hidden="true"
      />
    );
  }

  const greetings = {
    morning: {
      greeting: "Good morning",
      message: "Rise and shine! Ready to learn something new today?",
      icon: "🌅",
    },
    afternoon: {
      greeting: "Good afternoon",
      message: "Hope you're having a productive day! What will you learn next?",
      icon: "☀️",
    },
    evening: {
      greeting: "Good evening",
      message: "Perfect time to review what you've learned today!",
      icon: "🌙",
    },
  };

  const { greeting, message, icon } = greetings[timeOfDay] || greetings.morning;
  const userName = user.firstName || "there";

  return (
    <div
      className={`w-full p-8 bg-gradient-to-br from-primary via-blue-600 to-primary/80 dark:from-primary/90 dark:to-primary/80 rounded-3xl shadow-xl transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } border border-primary/20`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl mix-blend-overlay pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 text-primary-foreground">
          <div className="bg-white/30 p-4 sm:p-5 rounded-full backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center">
            <GraduationCap
              className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">
              {greeting}, <span className="text-white">{userName}</span>! {icon}
            </h2>
            <p className="text-primary-foreground/90 text-base sm:text-lg max-w-2xl font-medium">
              {message}
            </p>

            <div className="flex items-center gap-2 mt-4 text-sm sm:text-base text-primary-foreground/80 font-semibold">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>You have <span className="font-bold text-white">3</span> new study recommendations</span>
            </div>
          </div>

          <div className="ml-auto hidden md:flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-6 py-2.5 rounded-full cursor-pointer shadow-sm border border-white/10">
            <Link href="/dashboard/marketplace" className="flex items-center gap-2">
              <span className="text-base font-semibold">View all</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
