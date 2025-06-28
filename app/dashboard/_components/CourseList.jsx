"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useApp } from "@/app/_context/AppContext";

function CourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTotalCourses } = useApp();

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList();
    }
  }, [isLoaded, user]);

  const GetCourseList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/courses", {
        createdBy: user.primaryEmailAddress.emailAddress,
      });
      setCourseList(result.data.result || []);
      setTotalCourses(result.data.result.length);
    } catch (error) {
      console.error("Error fetching course list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div 
        className="w-full min-h-[50vh] flex items-center justify-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div 
          className="h-10 w-10 border-4 border-primary/20 rounded-full border-t-primary animate-spin"
          role="status"
          aria-label="Loading courses"
        >
          <span className="sr-only">Loading your courses...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="mt-8 md:mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Your Study Material
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary/80 animate-pulse"></span>
                Updating courses...
              </span>
            ) : (
              <>
                {courseList.length} {courseList.length === 1 ? 'course' : 'courses'} in total
                {courseList.length > 0 && (
                  <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 bg-muted rounded-full">
                    {courseList.filter(c => c.status === 'Completed').length} completed
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={GetCourseList}
          disabled={loading}
          className="gap-2 shrink-0"
          aria-label={loading ? 'Refreshing courses...' : 'Refresh courses'}
        >
          <RefreshCw 
            className={`h-4 w-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} 
            aria-hidden="true"
          />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {!loading && courseList.length === 0 ? (
        <div 
          className="border-2 border-dashed rounded-xl p-8 text-center bg-card/50 hover:bg-card/70 transition-colors"
          role="status"
          aria-label="No courses found"
        >
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="h-8 w-8 text-muted-foreground/60"
              aria-hidden="true"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M16 7V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">No courses found</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
            Get started by creating your first course. We'll help you organize your learning materials.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/create">
              Create your first course
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {loading ? (
            Array(6).fill(null).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-64 w-full rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse"
                aria-hidden="true"
              >
                <div className="h-3/4 bg-muted/40 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted/40 rounded w-3/4"></div>
                  <div className="h-3 bg-muted/30 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            courseList?.map((course, index) => (
              <div 
                key={`course-${course.id || index}-${course.title?.substring(0, 10) || 'untitled'}`}
                className="transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 rounded-xl focus-within:outline-none"
                tabIndex="0"
              >
                <CourseCardItem 
                  course={course}
                />
              </div>
            ))
          )}
        </div>
      )}
      
      {!loading && courseList.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Showing {courseList.length} of {courseList.length} courses
          </p>
        </div>
      )}
    </div>
  );
}

export default CourseList;
