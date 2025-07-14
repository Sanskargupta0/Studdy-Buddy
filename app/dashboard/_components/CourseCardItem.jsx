"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";

function CourseCardItem({ course, onDelete, userEmail, onRequestDelete, onRequestUnpublish }) {
  const statusColors = {
    'Ready': {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-200',
      icon: '✓',
      label: 'Course completed'
    },
    'Generating': {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-200',
      icon: '⌛',
      label: 'Generating content'
    }
  };

  const status = course?.status || 'Generating';
  const statusConfig = statusColors[status] || statusColors['Generating'];
  const title = course?.courseLayout?.courseTitle || 'Untitled Course';
  const description = course?.courseLayout?.courseSummary || 'No description available';
  const isGenerating = status === 'Generating';
  const isPublished = course?.isPublic || false;
  const upvotes = course?.upvotes || 0;
  const publicSlug = course?.publicSlug;

  // State for publishing
  const [publishing, setPublishing] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const response = await fetch("/api/marketplace/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyMaterialId: course.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Course published successfully! It's now available in the marketplace.");
        onDelete(); // Refresh the course list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to publish course");
      }
    } catch (error) {
      console.error("Error publishing course:", error);
      toast.error("Failed to publish course");
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = () => {
    onRequestUnpublish(course);
  };

  const publicUrl = publicSlug ? `${window.location.origin}/public/${publicSlug}` : null;

  return (
    <article 
      className="group relative h-full flex flex-col border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-card/80 hover:bg-card/90 overflow-hidden"
      aria-labelledby={`course-${course?.courseId}-title`}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 group-hover:bg-primary/15 dark:group-hover:bg-primary/25 transition-colors">
            <Image 
              src={"/knowledge.png"} 
              alt="" 
              width={40} 
              height={40} 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
              aria-hidden="true"
            />
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span 
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.bg} ${statusConfig.text}`}
              aria-label={statusConfig.label}
            >
              <span className="text-xs" aria-hidden="true">{statusConfig.icon}</span>
              <span>{status}</span>
            </span>
            
            {course?.createdAt && (
              <time 
                dateTime={new Date(course.createdAt).toISOString()}
                className="text-xs text-muted-foreground"
              >
                {new Date(course.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </time>
            )}
          </div>
        </div>
        
        <h3 
          id={`course-${course?.courseId}-title`}
          className="mt-4 font-semibold text-lg leading-snug text-foreground line-clamp-2"
        >
          {title}
        </h3>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
          {description}
        </p>

        <div className="mt-6 space-y-3">
          {/* Show published course controls */}
          {isPublished && !isGenerating && (
            <div className="flex flex-col gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  📢 Published Course
                </span>
                <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                  {upvotes} upvotes
                </div>
              </div>
              <div className="flex gap-2">
                {publicUrl && (
                  <Link href={publicUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View in Public Page
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnpublish}
                  className="flex-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Remove from Public
                </Button>
              </div>
            </div>
          )}

          {/* Show publish option for unpublished courses */}
          {!isPublished && !isGenerating && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePublish}
                disabled={publishing}
                className="text-xs"
              >
                {publishing ? 'Publishing...' : 'Publish to Marketplace'}
              </Button>
            </div>
          )}

          {/* Regular action buttons */}
          <div className="flex justify-end gap-2 items-center">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRequestDelete(course)}
              aria-label={`Delete course: ${title}`}
              disabled={isGenerating}
            >
              Delete
            </Button>
            {isGenerating ? (
              <Button 
                disabled 
                className="w-full sm:w-auto bg-muted hover:bg-muted text-muted-foreground"
                aria-live="polite"
                aria-label="Course content is being generated"
              >
                <span className="flex items-center gap-2">
                  <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                  Generating...
                </span>
              </Button>
            ) : (
              <Link 
                href={"/dashboard/course/" + course?.courseId} 
                className="w-full sm:w-auto"
                aria-label={`View course: ${title}`}
              >
                <Button className="w-full sm:w-auto">
                  Start Learning
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div> {/* Close the p-5 flex-1 flex flex-col div */}
    </article>
  );
}

export default CourseCardItem;
