"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useApp } from "@/app/_context/AppContext";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

function CourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setTotalCourses } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); // 6 courses per page to match the grid layout

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList();
    }
  }, [isLoaded, user]);

  // Auto-refresh if any course is generating
  useEffect(() => {
    if (loading) return; // Don't set interval while loading
    const anyGenerating = courseList.some(c => c.status === 'Generating');
    let intervalId;
    if (anyGenerating) {
      intervalId = setInterval(() => {
        GetCourseList();
      }, 10000); // 10 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [courseList, loading]);

  const GetCourseList = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/courses", {
        createdBy: user.primaryEmailAddress.emailAddress,
      });
      setCourseList(result.data.result || []);
      setTotalCourses(result.data.result.length);
      
      // Reset to first page if current page is beyond available pages
      const totalPages = Math.ceil((result.data.result || []).length / coursesPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching course list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const totalCourses = courseList.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const startIndex = (currentPage - 1) * coursesPerPage;
  const endIndex = startIndex + coursesPerPage;
  const currentCourses = courseList.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of course list when page changes
    document.querySelector('[data-course-list]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show ellipsis when there are many pages
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('ellipsis-start');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis-end');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleRequestDelete = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setDeleting(true);
    try {
      await axios.post("/api/courses/delete", { courseId: selectedCourse.courseId, email: user.primaryEmailAddress.emailAddress });
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
      GetCourseList();
    } catch (err) {
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeleting(false);
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
    <div className="mt-8 md:mt-10" data-course-list>
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
                {totalCourses} {totalCourses === 1 ? 'course' : 'courses'} in total
                {totalCourses > coursesPerPage && (
                  <span className="text-muted-foreground/70">
                    {' '}• Showing {startIndex + 1}-{Math.min(endIndex, totalCourses)} of {totalCourses}
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
            <Link href="/dashboard/create">
              Create your first course
            </Link>
          </Button>
        </div>
      ) : (
        <>
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
              currentCourses?.map((course, index) => (
                <div 
                  key={course.courseId || `course-${startIndex + index}`}
                  className="transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 rounded-xl focus-within:outline-none"
                  tabIndex="0"
                >
                  <CourseCardItem 
                    course={course}
                    onDelete={GetCourseList}
                    userEmail={user.primaryEmailAddress.emailAddress}
                    onRequestDelete={handleRequestDelete}
                  />
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {generatePageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      
      {/* Render the delete dialog at the root level, outside the grid */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Content onClose={() => setDeleteDialogOpen(false)}>
          <Dialog.Title icon={<svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>}>
            Delete Course
          </Dialog.Title>
          <p className="mb-6 text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold">{selectedCourse?.courseLayout?.courseTitle || 'this course'}</span>? This will permanently remove all notes, flashcards, quizzes, and recommendations for this course. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export default CourseList;
