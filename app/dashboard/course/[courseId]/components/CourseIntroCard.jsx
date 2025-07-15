import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      setPublicUrl(`/public/${data.publicSlug}`);
    } catch (error) {
      console.error("Error publishing study material:", error);
      setPublishError(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

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
            {course?.courseLayout?.courseTitle || "Untitled Course"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {course?.courseLayout?.courseSummary || "No description available"}
          </p>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
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
                className="w-4 h-4"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M9 6h6"></path>
                <path d="M9 14h4"></path>
              </svg>
              <span>
                {course?.courseLayout?.chapters?.length || 0} chapters
              </span>
            </div>
            <div className="flex items-center gap-2">
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
                className="w-4 h-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
              <span>{course?.difficultyLevel || "Easy"}</span>
            </div>
          
          {course?.isPublic && (
            <>
              <div className="relative group/share">
                <button className="p-1 rounded-md hover:bg-muted transition-colors flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                    <polyline points="16,6 12,2 8,6"></polyline>
                    <line x1="12" x2="12" y1="2" y2="15"></line>
                  </svg> Share
                </button>

                <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover/share:opacity-100 group-hover/share:visible transition-all duration-200 z-20">
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
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 10v12"></path>
                  <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                </svg>
                {course.upvotes} upvotes
              </div>
            </>
          )}
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
                <Link
                  href={`/public/${course.publicSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="w-full sm:w-auto">
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
                      className="mr-2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    View in Public page
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                onClick={handleMakePublic}
                disabled={isPublishing || publicUrl ? true : false}
                className="w-full sm:w-auto"
              >
                {isPublishing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
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
                      className="mr-2"
                    >
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
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
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
                  View in Public page <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {publishError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {publishError}</p>
        </div>
      )}
    </div>
  );
}

export default CourseIntroCard;
