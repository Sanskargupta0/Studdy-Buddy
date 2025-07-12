"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function CourseCardItem({ course, onDelete, userEmail, onRequestDelete }) {
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

  // Remove dialog state and handleDelete from here

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

        <div className="mt-6 flex justify-end gap-2 items-center">
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
      </div> {/* Close the p-5 flex-1 flex flex-col div */}

      {/* Remove Dialog */}
    </article>
  );
}

export default CourseCardItem;
