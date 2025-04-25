"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Moon, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function DashboardHeader() {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";
  const isUpgradeRoute = pathname === "/dashboard/upgrade";
  
  const [focusMode, setFocusMode] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [audio, setAudio] = useState(null);
  
  // Initialize audio on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAudio(new Audio('/sounds/zen-background.mp3'));
    }
  }, []);
  
  // Handle focus mode toggle
  const handleFocusModeToggle = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    
    // Disable zen mode if focus mode is disabled
    if (!newFocusMode && zenMode) {
      handleZenModeToggle();
    }
    
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
    }
  };
  
  // Handle zen mode toggle
  const handleZenModeToggle = () => {
    const newZenMode = !zenMode;
    setZenMode(newZenMode);
    
    if (audio) {
      if (newZenMode) {
        audio.loop = true;
        audio.volume = 0.3;
        audio.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  // Condition to check whether we should show both the logo + name and the user button
  const showLogoAndName = !( isDashboardRoute || isUpgradeRoute && window.innerWidth >= 768); // Only hide logo on medium screen (md) on /dashboard route

  return (
    <div
      className={`w-full p-3 shadow-md flex items-center ${
        showLogoAndName ? "justify-between" : "justify-end" // Adjust layout based on whether both are shown
      }`}
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

      {/* Focus Mode and User Button */}
      <div className="flex items-center gap-4">
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

        {focusMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleZenModeToggle}
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
