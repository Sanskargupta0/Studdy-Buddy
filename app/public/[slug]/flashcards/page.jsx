"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PublicFlashcardsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

        // Try to fetch flashcards
        try {
          const flashcardsResponse = await fetch(`/api/study-type-content?courseId=${courseData.course.courseId}&type=Flashcard`);
          if (flashcardsResponse.ok) {
            const flashcardsData = await flashcardsResponse.json();
            if (flashcardsData && flashcardsData.content) {
              setFlashcards(flashcardsData.content);
            }
          }
        } catch (flashcardsError) {
          console.log("No flashcards available for this course");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-80 w-full rounded-xl" />
          <div className="flex justify-center gap-4 mt-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
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
            <h1 className="text-2xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">
              {course?.courseLayout?.courseTitle}
            </p>
          </div>
        </div>

        {flashcards.length > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={shuffleCards}>
              <Shuffle className="w-4 h-4 mr-1" />
              Shuffle
            </Button>
            <Button variant="outline" size="sm" onClick={resetCards}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Flashcard Container */}
      {flashcards.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
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
              <rect width="20" height="14" x="2" y="3" rx="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No flashcards available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Flashcards for this course are not yet available. Check back later or explore other study materials.
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Card {currentCardIndex + 1} of {flashcards.length}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentCardIndex + 1) / flashcards.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Flashcard */}
          <div 
            className="relative h-80 cursor-pointer perspective-1000"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className={`relative w-full h-full transition-transform duration-600 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-card border border-border rounded-xl p-8 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Question</h3>
                  <p className="text-lg">{flashcards[currentCardIndex]?.front}</p>
                  <p className="text-sm text-muted-foreground mt-6">Click to reveal answer</p>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-primary/5 border border-primary/20 rounded-xl p-8 flex items-center justify-center rotate-y-180">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Answer</h3>
                  <p className="text-lg">{flashcards[currentCardIndex]?.back}</p>
                  <p className="text-sm text-muted-foreground mt-6">Click to flip back</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevCard}
              disabled={flashcards.length <= 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Flip
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={nextCard}
              disabled={flashcards.length <= 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
