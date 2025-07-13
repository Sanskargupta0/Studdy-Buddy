"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PublicChapterNotesPage() {
  const { slug, chapterId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [chapterNotes, setChapterNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/marketplace/course?slug=${slug}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData.course);

        // Try to fetch chapter notes
        try {
          const notesResponse = await fetch(`/api/study-type-content?courseId=${courseData.course.courseId}&type=notes&chapterId=${chapterId}`);
          if (notesResponse.ok) {
            const notesData = await notesResponse.json();
            setChapterNotes(notesData);
          }
        } catch (notesError) {
          console.log("No notes available for this chapter");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug && chapterId) {
      fetchData();
    }
  }, [slug, chapterId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Chapter Not Found
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error || "The chapter you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push(`/public/${slug}/notes`)}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  const chapters = course?.courseLayout?.chapters || [];
  const currentChapter = chapters[parseInt(chapterId)];
  const chapterIndex = parseInt(chapterId);

  if (!currentChapter) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Chapter Not Found
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            The chapter you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push(`/public/${slug}/notes`)}>
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/public/${slug}/notes`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Notes
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{currentChapter.title}</h1>
          <p className="text-muted-foreground">
            Chapter {chapterIndex + 1} • {course?.courseLayout?.courseTitle}
          </p>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="border border-border rounded-xl p-8 bg-card">
        {currentChapter.about && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Chapter Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {currentChapter.about}
            </p>
          </div>
        )}

        {chapterNotes && chapterNotes.notes ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Chapter Notes
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: chapterNotes.notes }} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium text-foreground">Notes not available</h3>
            <p className="text-muted-foreground mt-1">
              Detailed notes for this chapter are not yet available.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          {chapterIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => router.push(`/public/${slug}/notes/${chapterIndex - 1}`)}
            >
              ← Previous Chapter
            </Button>
          ) : (
            <div></div>
          )}

          {chapterIndex < chapters.length - 1 ? (
            <Button
              onClick={() => router.push(`/public/${slug}/notes/${chapterIndex + 1}`)}
            >
              Next Chapter →
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/public/${slug}`)}
            >
              Back to Course
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
