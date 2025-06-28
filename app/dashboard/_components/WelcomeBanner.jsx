"use client";

import { useUser } from "@clerk/nextjs";
import { GraduationCap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

function WelcomeBanner() {
  const { user, isLoaded } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');

  // Set time-based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
    
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded || !user) {
    return (
      <div className="w-full h-32 bg-muted/30 rounded-2xl animate-pulse" aria-hidden="true" />
    );
  }


  const greetings = {
    morning: {
      greeting: 'Good morning',
      message: 'Rise and shine! Ready to learn something new today?',
      icon: '🌅'
    },
    afternoon: {
      greeting: 'Good afternoon',
      message: 'Hope you\'re having a productive day! What will you learn next?',
      icon: '☀️'
    },
    evening: {
      greeting: 'Good evening',
      message: 'Perfect time to review what you\'ve learned today!',
      icon: '🌙'
    }
  };

  const { greeting, message, icon } = greetings[timeOfDay] || greetings.morning;
  const userName = user.firstName || 'there';

  return (
    <div 
      className={`w-full p-6 bg-gradient-to-r from-primary to-primary/90 dark:from-primary/90 dark:to-primary/80 rounded-2xl shadow-lg transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-4 w-24 h-24 bg-white/5 rounded-full mix-blend-overlay"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-primary-foreground">
          <div className="bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-sm border border-white/10 shadow-sm">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" aria-hidden="true" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {greeting}, <span className="text-white">{userName}</span>! {icon}
            </h2>
            <p className="text-primary-foreground/90 text-sm sm:text-base max-w-2xl">
              {message}
            </p>
            
            <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm text-primary-foreground/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>You have 3 new study recommendations</span>
            </div>
          </div>
          
          <div className="ml-auto hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full cursor-pointer">
            <span className="text-sm font-medium">View all</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
