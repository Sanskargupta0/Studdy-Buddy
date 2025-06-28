import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function CourseIntroCard({ course }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publicUrl, setPublicUrl] = useState(null);

  const handleMakePublic = async () => {
    if (!course?.id) return;
    
    setIsPublishing(true);
    setPublishError(null);
    
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
      
      if (!response.ok) {
        throw new Error("Failed to publish study material");
      }
      
      const data = await response.json();
      setPublicUrl(`/market/${data.publicSlug}`);
      
      // Refresh the course data to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error publishing study material:", error);
      setPublishError(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

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
          
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Course Progress</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
              <path d="M9 10h6"></path>
              <path d="M9 6h6"></path>
              <path d="M9 14h4"></path>
            </svg>
            <span>{course?.courseLayout?.chapters?.length || 0} chapters</span>
          </div>
        </div>
        
        {/* Action buttons */}
        {course?.status !== "Generating" && (
          <div className="w-full sm:w-auto mt-4 sm:mt-0">
            {course?.isPublic ? (
              <div className="flex flex-col items-end gap-3">
                <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                  Published to Marketplace
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/market/${course.publicSlug}`)}
                  className="w-full sm:w-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View in Marketplace
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleMakePublic} 
                disabled={isPublishing}
                className="w-full sm:w-auto"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Publish to Marketplace
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Success message */}
      {publicUrl && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Success! Your study material is now public in the marketplace.
              </p>
              <div className="mt-2 flex">
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  View in marketplace <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
            
      
      {/* Error message */}
      {publishError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            Error: {publishError}
          </p>
        </div>
      )}
    </div>
  );
}

export default CourseIntroCard;
