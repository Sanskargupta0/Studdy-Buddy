"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseIntroCard from "./components/CourseIntroCard";
import StudyMaterialSection from "./components/StudyMaterialSection";
import ChapterList from "./components/ChapterList";
import YouTubeRecommendations from "./components/YouTubeRecommendations";

function Course() {
  const { courseId } = useParams();
  const [course, setCourse] = useState();
  useEffect(() => {
    GetCourse();
  }, []);

  const GetCourse = async () => {
    const result = await axios.get("/api/courses?courseId=" + courseId);
    setCourse(result.data.result);
  };
  return (
    <div>
      <div>
        {/* Course Intro */}
        <CourseIntroCard course={course} />
        {/* Study Materials Options */}
        <StudyMaterialSection courseId={courseId} course={course} />
        {/* YouTube Recommendations */}
        <YouTubeRecommendations courseId={courseId} course={course} />
        {/* Chapter List */}
        <ChapterList course={course} />
      </div>
    </div>
  );
}

export default Course;
