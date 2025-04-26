"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, { useEffect, useState, createContext, useContext } from "react";
import { UserCreditsProvider } from "./_context/UserCreditsContext";

// Create ZenMode context
export const ZenModeContext = createContext({
  zenMode: false,
  toggleZenMode: () => {},
});

// Zen Mode Provider component
export function ZenModeProvider({ children }) {
  const [zenMode, setZenMode] = useState(false);
  
  // Initialize from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZenMode = localStorage.getItem('zenMode');
      if (savedZenMode !== null) {
        setZenMode(savedZenMode === 'true');
      }
    }
  }, []);
  
  // Function to toggle zen mode
  const toggleZenMode = () => {
    const newValue = !zenMode;
    setZenMode(newValue);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenMode', newValue.toString());
    }
  };
  
  return (
    <ZenModeContext.Provider value={{ zenMode, toggleZenMode }}>
      {children}
    </ZenModeContext.Provider>
  );
}

// Custom hook for zen mode
export function useZenMode() {
  const context = useContext(ZenModeContext);
  if (context === undefined) {
    throw new Error("useZenMode must be used within a ZenModeProvider");
  }
  return context;
}

function Provider({ children }) {
  const { user, isLoaded } = useUser();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      CheckIsNewUser();
    }
  }, [isLoaded, user]);

  const CheckIsNewUser = async () => {
    if (!user?.primaryEmailAddress?.emailAddress || !user?.fullName) return;

    try {
      setIsChecking(true);
      const resp = await axios.post("/api/create-user", {
        user: {
          userName: user.fullName, // Match the database field name exactly
          email: user.primaryEmailAddress.emailAddress,
        },
      });
      console.log("User check/creation successful:", resp.data);
    } catch (error) {
      console.error("Error checking/creating user:", error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <ZenModeProvider>
      <UserCreditsProvider>
        <div className={`min-h-screen`}>
          {children}
        </div>
      </UserCreditsProvider>
    </ZenModeProvider>
  );
}

export default Provider;
