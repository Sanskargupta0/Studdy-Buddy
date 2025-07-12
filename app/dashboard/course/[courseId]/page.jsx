"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseIntroCard from "./components/CourseIntroCard";
import StudyMaterialSection from "./components/StudyMaterialSection";
import ChapterList from "./components/ChapterList";
import YouTubeRecommendations from "./components/YouTubeRecommendations";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function Course() {
  const { courseId } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetCourse();
  }, []);

  const GetCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.get("/api/courses?courseId=" + courseId);
      setCourse(result.data.result);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Back to Dashboard Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Button>
      </div>

      {/* Course Intro */}
      {loading ? (
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      ) : (
        <CourseIntroCard course={course} />
      )}

      {/* Study Materials Options */}
      {loading ? (
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <StudyMaterialSection courseId={courseId} course={course} />
      )}

      {/* YouTube Recommendations */}
      {loading ? (
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-2/5 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <YouTubeRecommendations courseId={courseId} course={course} />
      )}

      {/* Chapter List */}
      {loading ? (
        <div className="rounded-xl p-6 border shadow-sm">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        <ChapterList courseId={courseId} course={course} />
      )}
    </div>
  );
}

export default Course;
