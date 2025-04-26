"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export const UserCreditsContext = createContext({
  credits: 0,
  isMember: false,
  loading: true,
  error: null,
  refreshCredits: () => {},
  decrementCredits: () => {},
});

export function UserCreditsProvider({ children }) {
  const [credits, setCredits] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded: isUserLoaded } = useUser();

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
  const decrementCredits = () => {
    // Only apply for non-members and if credits are available
    if (!isMember && credits > 0) {
      setCredits(prevCredits => prevCredits - 1);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isUserLoaded) {
      fetchUserCredits();
    }
  }, [isUserLoaded, user]);

  // Refresh function to call after purchases or operations
  const refreshCredits = () => {
    fetchUserCredits();
  };

  const value = {
    credits,
    isMember,
    loading,
    error,
    refreshCredits,
    decrementCredits,
  };

  return (
    <UserCreditsContext.Provider value={value}>
      {children}
    </UserCreditsContext.Provider>
  );
}

// Custom hook for easier context use
export function useUserCredits() {
  const context = useContext(UserCreditsContext);
  
  if (context === undefined) {
    throw new Error("useUserCredits must be used within a UserCreditsProvider");
  }
  
  return context;
} 