import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import CourseUpvoteButton from "./CourseUpvoteButton";

function PublicCourseIntroCard({ course }) {
  return (
    <div className="flex flex-col p-6 sm:p-8 border border-border bg-card rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
          <Image 
            src={"/knowledge.png"} 
            alt="Course icon" 
            width={80} 
            height={80} 
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>
        
        <div className="flex-1 w-full">
          <h2 className="font-bold text-2xl text-foreground">
            {course?.courseLayout?.courseTitle || 'Untitled Course'}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {course?.courseLayout?.courseSummary || 'No description available'}
          </p>
          
          <div className="mt-4 flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M9 6h6"></path>
                <path d="M9 14h4"></path>
              </svg>
              <span>{course?.courseLayout?.chapters?.length || 0} chapters</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z"></path>
              </svg>
              <span>By {course?.createdBy}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="m13 9l8 8"></path>
                <path d="m21 9l-8 8"></path>
              </svg>
              <span>{course?.difficultyLevel || "Easy"}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col gap-3">
          <CourseUpvoteButton courseId={course?.id} initialUpvotes={course?.upvotes || 0} />
          <Link href="/dashboard/create">
            <Button variant="outline" className="w-full sm:w-auto">
              Create Your Own Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicCourseIntroCard;
