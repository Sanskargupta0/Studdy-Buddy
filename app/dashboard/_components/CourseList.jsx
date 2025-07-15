"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import CourseCardItem from "./CourseCardItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { useApp } from "@/app/_context/AppContext";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
  const { setTotalCourses, credits, isMember } = useApp();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  
  // Unpublish dialog state
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);
  const [selectedUnpublishCourse, setSelectedUnpublishCourse] = useState(null);
  const [unpublishing, setUnpublishing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6); // 6 courses per page to match the grid layout
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList(currentPage);
    }
  }, [isLoaded, user, currentPage]);

  // Auto-refresh if any course is generating
  useEffect(() => {
    if (loading) return; // Don't set interval while loading
    const anyGenerating = courseList.some(c => c.status === 'Generating');
    let intervalId;
    if (anyGenerating) {
      intervalId = setInterval(() => {
        GetCourseList(currentPage);
      }, 10000); // 10 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [courseList, loading, currentPage]);

  const GetCourseList = async (page = 1) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/courses", {
        createdBy: user.primaryEmailAddress.emailAddress,
        page: page,
        limit: coursesPerPage
      });
      
      setCourseList(result.data.result || []);
      setPagination(result.data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: coursesPerPage,
        hasNext: false,
        hasPrev: false
      });
      setTotalCourses(result.data.pagination?.totalItems || 0);
      
    } catch (error) {
      console.error("Error fetching course list:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination values
  const totalCourses = pagination.totalItems;
  const totalPages = pagination.totalPages;

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of course list when page changes
    document.querySelector('[data-course-list]')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
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
      const startPage = Math.max(1, pagination.currentPage - 2);
      const endPage = Math.min(totalPages, pagination.currentPage + 2);
      
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

  // Handle create new course with credit checking
  const handleCreateNew = useCallback(async (e) => {
    if (!isMember && credits <= 0) {
      e.preventDefault();
      toast.error(
        "You have no credits left. Please upgrade to continue creating materials.",
        {
          action: {
            label: "Upgrade",
            onClick: () => router.push("/dashboard/upgrade"),
          },
        }
      );
      return false;
    }
  }, [isMember, credits, router]);

  const handleRequestDelete = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleRequestUnpublish = (course) => {
    setSelectedUnpublishCourse(course);
    setUnpublishDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;
    setDeleting(true);
    try {
      await axios.post("/api/courses/delete", { courseId: selectedCourse.courseId, email: user.primaryEmailAddress.emailAddress });
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
      
      // After deletion, check if current page is empty and go to previous page if needed
      if (courseList.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        GetCourseList(currentPage);
      }
    } catch (err) {
      alert("Failed to delete course. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!selectedUnpublishCourse) return;
    setUnpublishing(true);
    try {
      const response = await fetch("/api/marketplace/unpublish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyMaterialId: selectedUnpublishCourse.id,
          userId: user.primaryEmailAddress.emailAddress,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setUnpublishDialogOpen(false);
        setSelectedUnpublishCourse(null);
        GetCourseList(currentPage); // Refresh the course list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to unpublish course");
      }
    } catch (error) {
      console.error("Error unpublishing course:", error);
      toast.error("Failed to unpublish course");
    } finally {
      setUnpublishing(false);
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
                    {' '}• Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, totalCourses)} of {totalCourses}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => GetCourseList(currentPage)}
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
      ) : (        <>
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
              <>
                {/* Create Course Card */}
                <div className="transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 rounded-xl focus-within:outline-none">
                  <Link
                    href="/dashboard/create"
                    onClick={handleCreateNew}
                    className="block h-full w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card/70 transition-all duration-200 group focus:outline-none"
                    aria-label="Create new course"
                  >
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        Create Course
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Start building your next study material
                      </p>
                      {!isMember && (
                        <div className="mt-3 px-3 py-1 bg-primary/10 rounded-full">
                          <span className="text-xs font-medium text-primary">
                            {credits} credits left
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Existing Course Cards */}
                {courseList?.map((course, index) => (
                  <div 
                    key={course.courseId || `course-${index}`}
                    className="transition-all duration-200 hover:scale-[1.02] focus-within:ring-2 focus-within:ring-primary/30 focus-within:ring-offset-2 rounded-xl focus-within:outline-none"
                    tabIndex="0"
                  >
                    <CourseCardItem 
                      course={course}
                      onDelete={() => GetCourseList(currentPage)}
                      userEmail={user.primaryEmailAddress.emailAddress}
                      onRequestDelete={handleRequestDelete}
                      onRequestUnpublish={handleRequestUnpublish}
                    />
                  </div>
                ))}
              </>
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
                      disabled={!pagination.hasPrev}
                      className={!pagination.hasPrev ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {generatePageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          onClick={() => handlePageChange(pageNum)}
                          isActive={pagination.currentPage === pageNum}
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
                      disabled={!pagination.hasNext}
                      className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
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

      {/* Render the unpublish dialog at the root level, outside the grid */}
      <Dialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
        <Dialog.Content onClose={() => setUnpublishDialogOpen(false)}>
          <Dialog.Title icon={<span className="text-red-500">⚠️</span>}>
            Remove from Public
          </Dialog.Title>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-semibold">"{selectedUnpublishCourse?.courseLayout?.courseTitle || 'this course'}"</span> from the public marketplace?
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                This action will:
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Remove the course from the public marketplace</li>
                <li>• Delete all current upvotes ({selectedUnpublishCourse?.upvotes || 0} upvotes)</li>
                <li>• Remove from everyone's favorite lists</li>
                <li>• Make the course private again</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone. You can republish the course later, but all upvotes and favorites will start from zero.
            </p>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setUnpublishDialogOpen(false)}
              disabled={unpublishing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleUnpublish}
              disabled={unpublishing}
            >
              {unpublishing ? 'Removing...' : 'Remove from Public'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
}

export default CourseList;
