"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MessageSquare, ChevronDown, ChevronRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PublicQAPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [qaData, setQaData] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/marketplace/course?slug=${slug}`);
        if (!courseResponse.ok) {
          throw new Error("Failed to fetch course");
        }
        const courseData = await courseResponse.json();
        setCourse(courseData.course);

        // Try to fetch Q&A data
        try {
          const qaResponse = await fetch(`/api/study-type-content?courseId=${courseData.course.courseId}&type=QA`);
          if (qaResponse.ok) {
            const qaResponseData = await qaResponse.json();
            if (qaResponseData && qaResponseData.content) {
              setQaData(qaResponseData.content);
            }
          }
        } catch (qaError) {
          console.log("No Q&A available for this course");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-4">
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-xl p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Course Not Found
          </h2>
          <p className="text-red-700 dark:text-red-300 mb-6">
            {error || "The course you're looking for doesn't exist or is no longer public."}
          </p>
          <Button onClick={() => router.push("/dashboard/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/public/${slug}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Course
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Questions & Answers</h1>
          <p className="text-muted-foreground">
            {course?.courseLayout?.courseTitle}
          </p>
        </div>
      </div>

      {/* Q&A Content */}
      {qaData.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No Q&A available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Questions and answers for this course are not yet available. Check back later or explore other study materials.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-6">
            {qaData.length} question{qaData.length !== 1 ? 's' : ''} available
          </div>
          
          {qaData.map((qa, index) => {
            const isExpanded = expandedQuestions[index];
            
            return (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                      Q
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground leading-6">
                        {qa.question}
                      </h3>
                      {!isExpanded && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          Click to reveal answer...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-4">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="ml-12 pl-4 border-l-2 border-muted">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-medium text-sm">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="bg-muted/30 rounded-lg p-4">
                            <p className="text-foreground leading-relaxed">
                              {qa.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="bg-muted/30 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold mb-2">Need more help?</h3>
        <p className="text-muted-foreground mb-4">
          If you have additional questions about this course material, consider creating your own course to explore the topic further.
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard/create")}>
          Create Your Own Course
        </Button>
      </div>
    </div>
  );
}
