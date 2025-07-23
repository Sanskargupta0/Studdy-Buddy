"use client";
import React, { useState, useEffect } from "react";
import SelectOption from "./_components/SelectOption";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TopicInput from "./_components/TopicInput";
import axios from "axios";
import { nanoid } from "nanoid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useApp } from "@/app/_context/AppContext";

function CreateCourse() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { user, isLoaded: isUserLoaded } = useUser();
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { decrementCredits } = useApp();

  useEffect(() => {
    if (isUserLoaded) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserLoaded]);

  const router = useRouter();
  const handleUserInput = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const GenerateCourseOutline = async () => {
    if (!user) {
      toast.error("Please sign in to create a course");
      return;
    }
    
    const courseId = nanoid();
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-course-outline", {
        courseId: courseId,
        ...formData,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      });
      toast.success("Please wait while we generate your course!")
      decrementCredits();
      setFormData({})
      router.replace("/dashboard");
    } catch (error) {
      toast.error("Failed to generate course. ");
    } finally {
      setLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="text-center mb-10">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-center mb-8">
            <Skeleton className="h-8 w-8 rounded-full mr-4" />
            <Skeleton className="h-1 w-16 mx-2" />
            <Skeleton className="h-8 w-8 rounded-full ml-4" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex justify-end mt-8 pt-4 border-t border-border">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Create Your Study Material
        </h1>
        <p className="text-muted-foreground text-lg">
          Follow the steps to generate personalized study content
        </p>
      </div>
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step > 0 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              2
            </div>
          </div>
        </div>

        <div className="mb-8">
          {step === 0 ? (
            <SelectOption
              selectedStudyType={(value) => handleUserInput("courseType", value)}
            />
          ) : (
            <TopicInput
              setDifficultyLevel={(value) =>
                handleUserInput("difficultyLevel", value)
              }
              setTopic={(value) => handleUserInput("topic", value)}
            />
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border">
          <div>
            {step !== 0 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(0)}
                disabled={loading}
                className="min-w-[100px]"
              >
                Back
              </Button>
            )}
          </div>
          <Button 
            onClick={step === 0 ? () => setStep(1) : GenerateCourseOutline}
            disabled={loading}
            className="min-w-[100px] gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : step === 0 ? (
              'Continue'
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Generate Material
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return <CreateCourse />;
};
