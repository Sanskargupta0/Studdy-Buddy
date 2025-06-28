"use client";

import { createContext, useState, useEffect, useContext, useCallback, useMemo, memo } from "react";
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

// Memoized provider component to prevent unnecessary re-renders
function AppProvider({ children }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // User state
  const [credits, setCredits] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Course state
  const [totalCourses, setTotalCoursesState] = useState(0);
  
  // UI state
  const [zenMode, setZenModeState] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedZenMode = localStorage.getItem('zenMode');
      if (savedZenMode !== null) {
        setZenModeState(savedZenMode === 'true');
      }
    }
  }, []);

  // Memoized fetch user credits function
  const fetchUserCredits = useCallback(async () => {
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
    } catch (err) {
      console.error("Error fetching user credits:", err);
      setError("Failed to load user credits");
    } finally {
      setLoading(false);
    }
  }, [user, isUserLoaded]);

  // Memoized decrement credits function
  const decrementCredits = useCallback(async () => {
    if (!user) return false;
    
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      const response = await axios.post("/api/credits", { email });
      
      setCredits(response.data.remainingCredits);
      setIsMember(response.data.isMember);
      
      return response.data.success;
    } catch (err) {
      console.error("Error decrementing credits:", err);
      return false;
    }
  }, [user]);

  // Memoized toggle zen mode function
  const toggleZenMode = useCallback(() => {
    setZenModeState(prevZenMode => {
      const newValue = !prevZenMode;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('zenMode', newValue);
      }
      
      return newValue;
    });
  }, []);

  // Fetch credits when user changes
  useEffect(() => {
    if (isUserLoaded) {
      fetchUserCredits();
    }
  }, [isUserLoaded, fetchUserCredits]);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    credits,
    isMember,
    loading,
    error,
    totalCourses,
    zenMode,
    refreshCredits: fetchUserCredits,
    decrementCredits,
    toggleZenMode,
    setTotalCourses: setTotalCoursesState,
  }), [
    credits, 
    isMember, 
    loading, 
    error, 
    totalCourses, 
    zenMode, 
    fetchUserCredits, 
    decrementCredits, 
    toggleZenMode
  ]);  

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Memoize the provider to prevent unnecessary re-renders
export const MemoizedAppProvider = memo(AppProvider);

// Custom hook for using app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
