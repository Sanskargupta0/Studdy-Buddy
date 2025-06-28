"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

// Create the context with default values
export const AppContext = createContext({
  // User state
  credits: 0,
  isMember: false,
  loading: true,
  error: null,
  
  // Course state
  totalCourses: 0,
  
  // UI state
  zenMode: false,
  
  // Methods
  refreshCredits: () => {},
  decrementCredits: () => {},
  toggleZenMode: () => {},
  setTotalCourses: () => {},
});

export function AppProvider({ children }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // User state
  const [credits, setCredits] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Course state
  const [totalCourses, setTotalCourses] = useState(0);
  
  // UI state
  const [zenMode, setZenMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZenMode = localStorage.getItem('zenMode');
      if (savedZenMode !== null) {
        setZenMode(savedZenMode === 'true');
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
    } catch (error) {
      console.error("Error fetching user credits:", error);
      setError("Failed to load user credits");
    } finally {
      setLoading(false);
    }
  };

  // Decrement credits by 1
  const decrementCredits = async () => {
    if (!user) return false;
    
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      const response = await axios.post("/api/credits", { email });
      
      setCredits(response.data.remainingCredits);
      setIsMember(response.data.isMember);
      
      return response.data.success;
    } catch (error) {
      console.error("Error decrementing credits:", error);
      return false;
    }
  };

  // Toggle zen mode
  const toggleZenMode = () => {
    const newValue = !zenMode;
    setZenMode(newValue);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('zenMode', newValue.toString());
    }
  };

  // Fetch user credits when user changes
  useEffect(() => {
    if (user && isUserLoaded) {
      fetchUserCredits();
    } else {
      setLoading(false);
    }
  }, [user, isUserLoaded]);

  // Context value
  const value = {
    // User state
    credits,
    isMember,
    loading,
    error,
    
    // Course state
    totalCourses,
    setTotalCourses,
    
    // UI state
    zenMode,
    
    // Methods
    refreshCredits: fetchUserCredits,
    decrementCredits,
    toggleZenMode,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
