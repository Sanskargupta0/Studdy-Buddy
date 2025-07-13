import React, { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

function PublicChapterList({ courseId, course }) {
  const [expandedChapters, setExpandedChapters] = useState({});
  
  const CHAPTERS = course?.courseLayout?.chapters || [];
  
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
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
            {CHAPTERS.length} chapters • Explore the course content
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {CHAPTERS.map((chapter, index) => {
          const chapterId = `chapter-${index}`;
          const isExpanded = expandedChapters[chapterId];
          
          return (
            <div
              key={chapterId}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => toggleChapter(chapterId)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground leading-6">
                      {chapter.title}
                    </h3>
                    {chapter.about && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {chapter.about}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {chapter.duration || "5-10 min"}
                  </div>
                  
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {isExpanded && chapter.about && (
                <div className="px-4 pb-4 pt-0">
                  <div className="ml-11 pl-3 border-l-2 border-muted">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {chapter.about}
                      </p>
                      
                      {/* Chapter topics */}
                      {chapter.topics && chapter.topics.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium text-foreground mb-2">Topics covered:</h4>
                          <ul className="space-y-1">
                            {chapter.topics.map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-center text-xs text-muted-foreground">
                                <div className="w-1 h-1 bg-primary rounded-full mr-2"></div>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
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

export default PublicChapterList;
