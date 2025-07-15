"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import FlashcardItem from "./_components/FlashcardItem";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function Flashcards() {
  const { slug } = useParams();
  const router = useRouter();
  const [flashCards, setFlashCards] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [api, setApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    GetFlashCards();
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      setIsFlipped(false);
    });
  }, [api]);

  const GetFlashCards = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/marketplace/course?slug=${slug}`);
      const courseId = res?.data?.course?.courseId;
      if (!courseId) {
        console.error("Course ID not found in response");
        return;
      }
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "Flashcard",
      });
      setFlashCards(result?.data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      toast.error("Failed to load flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Course Button */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/public/${slug}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Course
        </Button>
      </div>

      <div className="text-center mb-8">
        <h2 className="font-bold text-3xl mb-2 text-primary">Flashcards</h2>
        <p className="text-gray-600">The Ultimate tool to lock in Concepts!</p>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="relative h-[400px] w-full">
            <Skeleton className="absolute inset-0 rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-pulse h-16 w-16 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <p className="text-gray-400">Loading flashcards...</p>
              </div>
            </div>
          </div>
        ) : flashCards?.content && flashCards.content.length > 0 ? (
          <Carousel setApi={setApi} className="max-w-3xl mx-auto">
            <CarouselContent>
              {flashCards.content?.map((flashcard, index) => {
                const questionPrefix = flashcard.question
                  ?.substring(0, 10)
                  ?.replace(/\s+/g, "-") || "q";
                const answerPrefix =
                  flashcard.answer?.substring(0, 10)?.replace(/\s+/g, "-") ||
                  "a";
                const flashcardKey = `flashcard-${index}-${questionPrefix}-${answerPrefix}`;

                return (
                  <CarouselItem
                    key={flashcardKey}
                    className="flex items-center justify-center"
                  >
                    <FlashcardItem
                      isFlipped={isFlipped}
                      handleClick={handleClick}
                      flashcard={flashcard}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0 mx-2" />
              <CarouselNext className="static translate-y-0 mx-2" />
            </div>
          </Carousel>
        ) : (
          <div className="text-center p-8 border border-dashed rounded-xl">
            <p className="text-gray-500">
              No flashcards available for this course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Flashcards;
