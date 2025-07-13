"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PublicNotesPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="space-y-6">
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
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

  const chapters = course?.courseLayout?.chapters || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/public/${slug}`)}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Course Notes</h1>
            <p className="text-muted-foreground">
              {course?.courseLayout?.courseTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Chapters List */}
      {chapters.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium text-foreground">No chapters available</h3>
          <p className="text-muted-foreground mt-1">
            This course doesn't have any chapters yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <Link
              key={index}
              href={`/public/${slug}/notes/${index}`}
              className="block"
            >
              <div className="border border-border rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-card">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {chapter.title}
                    </h3>
                    {chapter.about && (
                      <p className="text-muted-foreground line-clamp-2">
                        {chapter.about}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      <span>Chapter {index + 1}</span>
                      <span>•</span>
                      <span>{chapter.duration || "5-10 min read"}</span>
                    </div>
                  </div>
                  <div className="text-primary text-sm font-medium">
                    Read Notes →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
