"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CourseUpvoteButton({ courseId, initialUpvotes = 0 }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpvote = async () => {
    if (hasUpvoted || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/marketplace/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyMaterialId: courseId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to upvote");
      }
      
      const data = await response.json();
      setUpvotes(data.upvotes);
      setHasUpvoted(true);
      
      // Store in localStorage to remember this user upvoted this course
      localStorage.setItem(`upvoted-${courseId}`, "true");
      
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check localStorage on component mount
  React.useEffect(() => {
    const hasUserUpvoted = localStorage.getItem(`upvoted-${courseId}`);
    if (hasUserUpvoted === "true") {
      setHasUpvoted(true);
    }
  }, [courseId]);
  
  return (
    <Button 
      variant={hasUpvoted ? "secondary" : "outline"} 
      size="sm"
      className="flex items-center gap-1.5"
      onClick={handleUpvote}
      disabled={hasUpvoted || isLoading}
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
        className="w-4 h-4"
      >
        <path d="M7 10v12"></path>
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
      </svg>
      {isLoading ? 'Upvoting...' : `${upvotes} upvote${upvotes !== 1 ? 's' : ''}`}
    </Button>
  );
}
