"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import PublicCourseIntroCard from "./components/PublicCourseIntroCard";
import PublicStudyMaterialSection from "./components/PublicStudyMaterialSection";
import PublicChapterList from "./components/PublicChapterList";
import PublicYouTubeRecommendations from "./components/PublicYouTubeRecommendations";

export default function PublicCoursePage({ params }) {
  const { isSignedIn} = useUser();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);

  useEffect(() => {
    const initializeSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    
    initializeSlug();
  }, [params]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/marketplace/course?slug=${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }
        const data = await response.json();
        setCourse(data.course);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-8 pb-10">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>

        {/* Course Intro Skeleton */}
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>

        {/* Study Materials Skeleton */}
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* YouTube Recommendations Skeleton */}
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-2/5 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Chapter List Skeleton */}
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Course Not Found
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error || "The course you're looking for doesn't exist or is no longer public."}
          </p>
          <Button onClick={() => router.push("/dashboard/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Back to Marketplace Button */}
      {isSignedIn && (
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/marketplace")}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </Button>
      </div>
      )}

      {/* Course Intro */}
      <PublicCourseIntroCard course={course} />

      {/* Study Materials Options */}
      <PublicStudyMaterialSection courseId={course.courseId} course={course} />

      {/* YouTube Recommendations */}
      <PublicYouTubeRecommendations courseId={course.courseId} />

      {/* Chapter List */}
      <PublicChapterList course={course} />

      {/* CTA Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Want to create your own course?</h2>
        <p className="text-muted-foreground mb-4">
          Sign up or log in to create, customize, and share your own study materials.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.push("/dashboard/create")}>
            Create a Course
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard/marketplace")}>
            Explore More Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
