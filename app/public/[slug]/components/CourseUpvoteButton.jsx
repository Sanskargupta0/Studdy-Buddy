"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function CourseUpvoteButton({ courseId, initialUpvotes = 0 }) {
  const { user, isLoaded } = useUser();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user has upvoted when component mounts and user data is loaded
  useEffect(() => {
    const checkUpvoteStatus = async () => {
      if (!user || !isLoaded || !courseId) return;
      
      try {
        const response = await fetch(`/api/marketplace/upvote?userId=${user.id}&studyMaterialId=${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setHasUpvoted(data.isUpvoted);
        }
      } catch (error) {
        console.error("Error checking upvote status:", error);
      }
    };

    checkUpvoteStatus();
  }, [user, isLoaded, courseId]);
  
  const handleUpvote = async () => {
    if (isLoading) return;
    
    // Check if user is logged in
    if (!user || !isLoaded) {
      // Store in localStorage for non-logged users as fallback
      if (!hasUpvoted) {
        localStorage.setItem(`upvoted-${courseId}`, "true");
        setHasUpvoted(true);
        setUpvotes(prevUpvotes => prevUpvotes + 1);
        toast.success("Course upvoted! Please log in to sync your preferences.");
      }
      toast.error("Please log in to upvote this course");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/marketplace/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyMaterialId: courseId,
          userId: user.id,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upvote");
      }
      
      const data = await response.json();
      setUpvotes(data.upvotes);
      setHasUpvoted(data.isUpvoted);
      
      toast.success(data.message || (data.isUpvoted ? "Course upvoted!" : "Upvote removed"));
      
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error(error.message || "Failed to upvote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check localStorage on component mount (fallback for non-logged users)
  useEffect(() => {
    if (!user && isLoaded) {
      const hasUserUpvoted = localStorage.getItem(`upvoted-${courseId}`);
      if (hasUserUpvoted === "true") {
        setHasUpvoted(true);
      }
    }
  }, [courseId, user, isLoaded]);
  
  return (
    <Button 
      variant={hasUpvoted ? "secondary" : "outline"} 
      size="sm"
      className="flex items-center gap-1.5 min-w-[100px] justify-center"
      onClick={handleUpvote}
      disabled={isLoading}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={hasUpvoted ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="w-4 h-4 flex-shrink-0"
      >
        <path d="M7 10v12"></path>
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
      </svg>
      <span className="text-sm font-medium">
        {isLoading ? 'Loading...' : `${upvotes} ${upvotes !== 1 ? 'upvotes' : 'upvote'}`}
      </span>
    </Button>
  );
}
