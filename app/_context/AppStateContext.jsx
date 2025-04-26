"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

// Create AppState context
export const AppStateContext = createContext({
  credits: 0,
  isMember: false,
  zenModeActive: false,
  loading: true,
  error: null,
  refreshCredits: () => {},
  decrementCredits: () => {},
  toggleZenMode: () => {},
});

export function AppStateProvider({ children }) {
  const [credits, setCredits] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [zenModeActive, setZenModeActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded: isUserLoaded } = useUser();

  // Initialize from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZenMode = localStorage.getItem('zenMode');
      if (savedZenMode !== null) {
        setZenModeActive(savedZenMode === 'true');
      }
    }
  }, []);

  // Fetch user credits and membership status
  const fetchUserCredits = async () => {
    if (!user || !isUserLoaded) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      
      if (!email) {
        setError("User email not found");
        return;
      }
      
      const response = await axios.get(`/api/credits?email=${email}`);
      setCredits(response.data.credits);
      setIsMember(response.data.isMember);
      
      // Debug: Log the response from the server
      console.log("Credits API response:", response.data);
    } catch (error) {
      console.error("Error fetching user credits:", error);
      setError("Failed to load user credits");
    } finally {
      setLoading(false);
    }
  };

  // Decrement credits by 1
  const decrementCredits = async () => {
    if (!user) return;
    
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      
      // Make API call to decrement credits
      const response = await axios.post("/api/credits", { email });
      
      // Update local state based on response
      setCredits(response.data.remainingCredits);
      setIsMember(response.data.isMember);
      
      // Debug: Log the response from the server
      console.log("Decrement credits response:", response.data);
      
      return response.data.success;
    } catch (error) {
      console.error("Error decrementing credits:", error);
      return false;
    }
  };

  // Function to toggle zen mode
  const toggleZenMode = () => {
    const newValue = !zenModeActive;
    setZenModeActive(newValue);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenMode', newValue.toString());
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isUserLoaded && user) {
      fetchUserCredits();
    }
  }, [isUserLoaded, user]);

  // Set up periodic refresh to catch plan changes
  useEffect(() => {
    // Refresh credits every 2 minutes to catch plan changes
    const intervalId = setInterval(() => {
      if (isUserLoaded && user) {
        fetchUserCredits();
      }
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [isUserLoaded, user]);

  // Refresh function to call after purchases or operations
  const refreshCredits = () => {
    fetchUserCredits();
  };

  const value = {
    credits,
    isMember,
    zenModeActive,
    loading,
    error,
    refreshCredits,
    decrementCredits,
    toggleZenMode,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hook for using app state
export function useAppState() {
  const context = useContext(AppStateContext);
  
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  
  return context;
}