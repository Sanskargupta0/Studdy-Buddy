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
    <div className="flex flex-col p-10 border shadow-md rounded-lg">
      <div className="flex gap-5 items-center">
        <Image src={"/knowledge.png"} alt="knowledge" width={70} height={70} />
        <div className="flex-1">
          <h2 className="font-bold text-2xl">
            {course?.courseLayout?.courseTitle}
          </h2>
          <p>{course?.courseLayout?.courseSummary}</p>
          <Progress className="mt-3" />

          <h2 className="mt-3 text-lg text-primary">
            Total Chapters: {course?.courseLayout?.chapters?.length}
          </h2>
        </div>
        
        {/* Only show this if the course is ready (not generating) */}
        {course?.status !== "Generating" && (
          <div className="ml-4">
            {course?.isPublic ? (
              <div className="flex flex-col items-end">
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-2">
                  Public
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => router.push(`/market/${course.publicSlug}`)}
                >
                  View in Marketplace
                </Button>
              </div>
            ) : (
              <div>
                <Button 
                  onClick={handleMakePublic} 
                  disabled={isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Make Public"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Success message */}
      {publicUrl && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 mb-2">
            Success! Your study material is now public in the marketplace.
          </p>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(publicUrl)}
            >
              View in Marketplace
            </Button>
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
