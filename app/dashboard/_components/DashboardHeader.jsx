"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Moon, Volume2, VolumeX, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useZenMode } from "@/app/provider";
import { useUserCredits } from "@/app/_context/UserCreditsContext";

function DashboardHeader() {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";
  const isUpgradeRoute = pathname === "/dashboard/upgrade";
  
  const [focusMode, setFocusMode] = useState(false);
  const { zenMode, toggleZenMode } = useZenMode();
  const { credits, isMember, loading: creditsLoading } = useUserCredits();
  const [audio, setAudio] = useState(null);
  
  // Initialize audio on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/sounds/zen-background.mp3'));
    }
  }, []);
  
  // Handle audio for zen mode
  useEffect(() => {
    if (!audio) return;
    
    if (zenMode) {
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [zenMode, audio]);
  
  // Handle focus mode toggle
  const handleFocusModeToggle = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    
    // Add visual indication for focus mode
    if (newFocusMode) {
      document.body.classList.add('focus-mode');
      
      // Suppress notifications
      if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            // We would suppress notifications here
          }
        });
      }
    } else {
      document.body.classList.remove('focus-mode');
      
      // Turn off zen mode when turning off focus mode
      if (zenMode) {
        toggleZenMode();
      }
    }
  };

  // Render mode - if we're in zen mode, some UI elements should be minimal
  const showLogoAndName = !(isDashboardRoute || isUpgradeRoute) || window.innerWidth >= 768;

  return (
    <div
      className={`w-full p-3 shadow-md flex items-center ${
        showLogoAndName ? "justify-between" : "justify-end"
      } ${zenMode ? "bg-gray-50" : ""}`}
    >
      {/* Logo and Name - shown based on screen size and route */}
      {showLogoAndName && (
        <div className="flex items-center space-x-2">
          <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          <Link href={"/dashboard"}>
            <span className="text-xl md:text-2xl font-bold">Studdy Buddy</span>
          </Link>
        </div>
      )}

      {/* User info, Focus Mode and User Button */}
      <div className="flex items-center gap-4">
        {/* Credits indicator */}
        {!creditsLoading && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 
                  ${isMember ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  {isMember ? "Premium" : `${credits} Credits`}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isMember 
                  ? "You have unlimited access with your premium membership" 
                  : `You have ${credits} credits remaining`}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {/* Focus mode toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  id="focus-mode"
                  checked={focusMode}
                  onCheckedChange={handleFocusModeToggle}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor="focus-mode" className="text-sm cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Moon className="h-4 w-4" />
                    <span>Focus</span>
                  </div>
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enable Focus Mode to minimize distractions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Zen mode toggle */}
        {focusMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={toggleZenMode}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {zenMode ? <Volume2 className="h-5 w-5 text-blue-600" /> : <VolumeX className="h-5 w-5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{zenMode ? "Disable" : "Enable"} zen sounds</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* User Button */}
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
