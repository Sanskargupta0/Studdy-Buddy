"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, Zap, Moon, Sun, Menu, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";
import { useApp } from "@/app/_context/AppContext";
import { cn } from "@/lib/utils";

function DashboardHeader({ onBurgerClick, className, ...props }) {
  const { zenMode, toggleZenMode, credits, isMember, loading: creditsLoading } = useApp();
  const pathname = usePathname();
  const [audio, setAudio] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Initialize audio on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audioElement = new Audio('/sounds/zen-background.mp3');
      audioElement.loop = true;
      audioElement.volume = 0.3;
      setAudio(audioElement);

      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, []);

  // Handle audio play/pause based on zenMode
  useEffect(() => {
    if (!audio) return;
    
    const handleAudio = async () => {
      if (zenMode) {
        try {
          await audio.play();
        } catch (error) {
          console.error("Audio play failed:", error);
          // Reset zen mode if audio fails to play
          if (toggleZenMode) toggleZenMode();
        }
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    };
    
    handleAudio();
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [zenMode, audio, toggleZenMode]);

  // Set mounted state for client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Toggle theme with animation
  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
    
    // Add animation class to body
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  }, [isDark, setTheme]);

  // Don't render on server to avoid hydration mismatch
  if (!isMounted) {
    return (
      <header className={cn(
        "w-full p-3 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border",
        "dark:bg-background/80",
        className
      )}>
        <div className="md:hidden w-8 h-8" />
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-24 h-9 rounded-full bg-muted animate-pulse" />
          <div className="w-16 h-9 rounded-lg bg-muted animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header 
      className={cn(
        "w-full p-3 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b border-border",
        "dark:bg-background/80 transition-colors duration-300",
        zenMode && "dark:bg-gray-900/80",
        className
      )}
      {...props}
    >
      {/* Burger menu for mobile */}
      <button
        onClick={onBurgerClick}
        className={cn(
          "md:hidden mr-3 p-2 rounded-md",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring",
          "transition-all duration-200"
        )}
        aria-expanded={false}
        aria-controls="sidebar-menu"
        aria-label="Toggle sidebar menu"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>
      
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Credits indicator */}
        {!creditsLoading && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5",
                    "transition-all duration-200 hover:scale-[1.02] active:scale-95",
                    "border border-transparent hover:border-border/50",
                    isMember 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" 
                      : "bg-muted text-foreground"
                  )}
                  aria-label={isMember ? 'Premium membership active' : `You have ${credits} credits remaining`}
                >
                  <Zap className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap font-medium">
                    {isMember ? (
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                        Premium
                      </span>
                    ) : (
                      `${credits} ${credits === 1 ? 'Credit' : 'Credits'}`
                    )}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm max-w-[280px] p-3">
                <div className="space-y-1">
                  <h4 className="font-semibold">
                    {isMember ? '🎉 Premium Member' : 'Credits'}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {isMember 
                      ? 'You have unlimited access with your premium membership!'
                      : `You have ${credits} ${credits === 1 ? 'credit' : 'credits'} remaining.`}
                  </p>
                  {!isMember && (
                    <Button 
                      size="sm" 
                      className="mt-2 w-full text-xs"
                      onClick={() => window.location.href = '/dashboard/upgrade'}
                    >
                      Upgrade to Premium
                    </Button>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Zen mode toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Switch
                    id="zen-mode"
                    checked={zenMode}
                    onCheckedChange={toggleZenMode}
                    className={cn(
                      "data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted-foreground/30",
                      "transition-all duration-200 hover:scale-105 active:scale-95"
                    )}
                    aria-label={zenMode ? 'Disable Zen Mode' : 'Enable Zen Mode'}
                  />
                  <div className={cn(
                    "absolute inset-0 rounded-full pointer-events-none transition-all duration-200",
                    zenMode ? "ring-2 ring-emerald-400/30" : "ring-0"
                  )} />
                </div>
                <Label 
                  htmlFor="zen-mode" 
                  className={cn(
                    "flex items-center gap-1.5 cursor-pointer text-sm font-medium",
                    "text-foreground/90 hover:text-foreground transition-colors"
                  )}
                >
                  {zenMode ? (
                    <Volume2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <VolumeX className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="sr-only sm:not-sr-only sm:inline">Zen Mode</span>
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-sm p-3 max-w-[240px]">
              <div className="space-y-1">
                <h4 className="font-semibold">
                  {zenMode ? 'Zen Mode Active' : 'Zen Mode'}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {zenMode 
                    ? 'Background music and focus mode enabled. Perfect for deep work.' 
                    : 'Turn on for a focused, distraction-free experience with ambient sounds.'}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

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
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
              {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Button */}
        <div className="ml-1 relative">
          <div className="relative">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '2rem',
                    height: '2rem',
                  },
                },
              }}
            />
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
              "bg-emerald-500"
            )} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(DashboardHeader);
