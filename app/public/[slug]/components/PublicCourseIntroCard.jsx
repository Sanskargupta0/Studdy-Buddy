import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import CourseUpvoteButton from "./CourseUpvoteButton";
import { toast } from "sonner";

function PublicCourseIntroCard({ course }) {

  const handleShare = (platform) => {
      const text = `Check out this course: ${course?.courseLayout?.courseTitle || "Untitled Course"}`;
      const publicUrl = course?.isPublic ? `${window.location.origin}/public/${course.publicSlug}` : "";
      if (platform === "whatsapp") {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${text} ${publicUrl}`
        )}`;
        window.open(whatsappUrl, "_blank");
      } else if (platform === "copy") {
        navigator.clipboard.writeText(publicUrl);
        toast.success("Course URL copied to clipboard!");
      }
    };

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8 border border-border bg-card rounded-xl shadow-sm max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
        {/* Course Icon */}
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg flex-shrink-0 mx-auto lg:mx-0">
          <Image 
            src={"/knowledge.png"} 
            alt="Course icon" 
            width={80} 
            height={80} 
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </div>
        
        {/* Course Content */}
        <div className="flex-1 w-full min-w-0">
          <h2 className="font-bold text-lg sm:text-xl lg:text-2xl text-foreground text-center lg:text-left leading-tight">
            {course?.courseLayout?.courseTitle || 'Untitled Course'}
          </h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base text-center lg:text-left line-clamp-3">
            {course?.courseLayout?.courseSummary || 'No description available'}
          </p>
          
          {/* Course Info Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-muted-foreground text-sm">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M9 6h6"></path>
                <path d="M9 14h4"></path>
              </svg>
              <span className="font-medium">{course?.courseLayout?.chapters?.length || 0} chapters</span>
            </div>
            
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m16.2 7.8-2 6.3-6.4 2.1 2-6.3z"></path>
              </svg>
              <span className="truncate font-medium">By {course?.createdBy}</span>
            </div>
            
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span className="font-medium">{course?.difficultyLevel || "Easy"}</span>
            </div>
            
            {/* Share Button */}
            <div className="relative group/share flex justify-center lg:justify-start">
              <button className="p-1 rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 flex-shrink-0"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16,6 12,2 8,6"></polyline>
                  <line x1="12" x2="12" y1="2" y2="15"></line>
                </svg>
                <span>Share</span>
              </button>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-200 z-20">
                <div className="bg-white dark:bg-gray-800 border border-border rounded-lg shadow-lg p-2 min-w-32">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare("copy");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="flex-shrink-0"
                    >
                      <rect
                        width="14"
                        height="14"
                        x="8"
                        y="8"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                    </svg>
                    Copy URL
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare("whatsapp");
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="flex-shrink-0"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                    </svg>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="w-full lg:w-auto mt-4 lg:mt-0 flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
          <CourseUpvoteButton courseId={course?.id} initialUpvotes={course?.upvotes || 0} />
          <Link href="/dashboard/create" className="w-full">
            <Button variant="outline" className="w-full text-sm sm:text-base">
              Create Your Own Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicCourseIntroCard;
