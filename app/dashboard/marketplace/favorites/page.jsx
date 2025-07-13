"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function FavoritesPage() {
  const { user } = useUser();
  const [favoriteCourses, setFavoriteCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoriteCourses = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // First get user's favorite course IDs
      const favoritesResponse = await fetch(`/api/marketplace/favorites?userId=${user.id}`);
      if (!favoritesResponse.ok) {
        throw new Error("Failed to fetch favorites");
      }
      const favoritesData = await favoritesResponse.json();
      const favoriteIds = favoritesData.favorites || [];

      if (favoriteIds.length === 0) {
        setFavoriteCourses([]);
        return;
      }

      // Then fetch all courses and filter by favorites
      const coursesResponse = await fetch(`/api/marketplace?limit=1000`);
      if (!coursesResponse.ok) {
        throw new Error("Failed to fetch courses");
      }
      const coursesData = await coursesResponse.json();
      const allCourses = coursesData.courses || [];

      // Filter courses that are in favorites
      const filteredCourses = allCourses.filter(course => 
        favoriteIds.includes(course.courseId)
      );

      setFavoriteCourses(filteredCourses);
    } catch (error) {
      console.error("Error fetching favorite courses:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFavoriteCourses();
    }
  }, [user?.id]);

  const handleRemoveFavorite = async (courseId) => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/marketplace/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId, userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        // Remove the course from the local state
        setFavoriteCourses(prev => 
          prev.filter(course => course.courseId !== courseId)
        );
      } else {
        toast.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove from favorites");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your favorites</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorite Courses</h1>
        <p className="text-muted-foreground">
          Your collection of saved courses
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">Error: {error}</p>
        </div>
      ) : favoriteCourses.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground w-10 h-10"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No favorite courses yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Start exploring the marketplace and save your favorite courses here.
          </p>
          <Link href="/dashboard/marketplace">
            <Button>
              Browse Marketplace
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCourses.map((course) => (
            <FavoriteCourseCard 
              key={course.id} 
              course={course} 
              onRemoveFavorite={handleRemoveFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FavoriteCourseCard({ course, onRemoveFavorite }) {
  const courseTitle = course?.courseLayout?.courseTitle || "Untitled Course";
  const courseSummary = course?.courseLayout?.courseSummary || "No description available";
  const chapterCount = course?.courseLayout?.chapters?.length || 0;

  return (
    <div className="border border-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col relative group">
      {/* Remove Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemoveFavorite(course.courseId);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-red-500"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z"></path>
        </svg>
      </button>

      <Link href={`/dashboard/course/${course.courseId}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Image
                src="/knowledge.png"
                alt="Course icon"
                width={48}
                height={48}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-xl line-clamp-2">{courseTitle}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                By {course.createdBy}
              </p>
            </div>
          </div>
          
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
            {courseSummary}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M9 6h6"></path>
                <path d="M9 14h4"></path>
              </svg>
              <span>{chapterCount} chapters</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none"
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4 text-muted-foreground"
              >
                <path d="M7 10v12"></path>
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
              </svg>
              <span className="text-muted-foreground">{course.upvotes || 0}</span>
              <span className="text-primary ml-2">View course →</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
