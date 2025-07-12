import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function ChapterList({ courseId, course }) {
  const [expandedChapters, setExpandedChapters] = useState({});
  const [completedChapters, setCompletedChapters] = useState({});
  
  const CHAPTERS = course?.courseLayout?.chapters || [];
  
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };
  
  const toggleChapterCompletion = (chapterId, e) => {
    e.stopPropagation();
    setCompletedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  if (CHAPTERS.length === 0) {
    return (
      <div className="mt-8 text-center py-12 border border-dashed rounded-lg">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium text-foreground">No chapters yet</h3>
        <p className="text-muted-foreground mt-1">This course doesn't have any chapters yet.</p>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Course Chapters</h2>
          <p className="text-muted-foreground mt-1">
            {CHAPTERS.length} chapters • Follow along with the course content
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {CHAPTERS.map((chapter, index) => {
          const chapterId = `chapter-${index}`;
          const isExpanded = expandedChapters[chapterId];
          const isCompleted = completedChapters[chapterId];
          
            return (
            <div 
              key={chapterId}
              className="border border-border bg-card rounded-lg overflow-hidden transition-all hover:shadow-sm"
            >
              <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleChapter(chapterId)}
              >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                <span className="text-lg">{chapter?.emoji || '📚'}</span>
                </div>
                <div>
                <h3 className={cn(
                  "font-medium text-foreground",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {chapter?.chapterTitle || `Chapter ${index + 1}`}
                </h3>
                {!isExpanded && chapter?.chapterSummary && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                  {chapter.chapterSummary}
                  </p>
                )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                onClick={(e) => toggleChapterCompletion(chapterId, e)}
                className={cn(
                  "p-1.5 rounded-full transition-colors",
                  isCompleted 
                  ? "text-green-500"
                  : "text-muted-foreground hover:bg-muted"
                )}
                aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
                >
                <CheckCircle className="h-5 w-5" />
                </button>
                
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                </button>
              </div>
              </div>
              
              {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-border">
                {chapter?.chapterSummary ? (
                <p className="text-muted-foreground">
                  {chapter.chapterSummary}
                </p>
                ) : (
                <p className="text-muted-foreground italic">No description available</p>
                )}
                
                <div className="mt-4 flex justify-end space-x-3">
                <Link
                  href={`/dashboard/course/${courseId}/notes/${index}`}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Start Chapter
                </Link>
                </div>
              </div>
              )}
            </div>
            );
        })}
      </div>
    </section>
  );
}

export default ChapterList;
