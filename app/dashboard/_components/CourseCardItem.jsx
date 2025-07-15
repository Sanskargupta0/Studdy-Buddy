"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

function CourseCardItem({
  course,
  onDelete,
  userEmail,
  onRequestDelete,
  onRequestUnpublish,
}) {
  const statusColors = {
    Ready: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-200",
      icon: "✓",
      label: "Course completed",
    },
    Generating: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-800 dark:text-amber-200",
      icon: "⌛",
      label: "Generating content",
    },
  };

  const status = course?.status || "Generating";
  const statusConfig = statusColors[status] || statusColors["Generating"];
  const title = course?.courseLayout?.courseTitle || "Untitled Course";
  const description =
    course?.courseLayout?.courseSummary || "No description available";
  const isGenerating = status === "Generating";
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
        toast.success(
          "Course published successfully! It's now available in the marketplace."
        );
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

  const publicUrl = publicSlug
    ? `${window.location.origin}/public/${publicSlug}`
    : null;

  const handleShare = (platform) => {
      const text = `Check out this course: ${course?.courseLayout?.courseTitle || "Untitled Course"}`;
      
      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${publicUrl}`)}`;
        window.open(whatsappUrl, '_blank');
      } else if (platform === 'copy') {
        navigator.clipboard.writeText(publicUrl);
        toast.success("Course URL copied to clipboard!");
      }
    };

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
              <span className="text-xs" aria-hidden="true">
                {statusConfig.icon}
              </span>
              <span>{status}</span>
            </span>

            {course?.createdAt && (
              <time
                dateTime={new Date(course.createdAt).toISOString()}
                className="text-xs text-muted-foreground"
              >
                {new Date(course.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
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
                  {upvotes} upvotes
                </div>
              </div>
              <div className="flex gap-2">
                {publicUrl && (
                  <Link
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
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
                {publishing ? "Publishing..." : "Publish to Marketplace"}
              </Button>
            </div>
          )}

          {/* Regular action buttons */}
          <div className="flex justify-end gap-2 items-center">
            {isPublished && (
              <div className="relative group/share">
                <button className="p-1 rounded-md hover:bg-muted transition-colors">
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
                  </svg>
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
            )}
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
                  <span
                    className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                  ></span>
                  Generating...
                </span>
              </Button>
            ) : (
              <Link
                href={"/dashboard/course/" + course?.courseId}
                className="w-full sm:w-auto"
                aria-label={`View course: ${title}`}
              >
                <Button className="w-full sm:w-auto">Start Learning</Button>
              </Link>
            )}
          </div>
        </div>
      </div>{" "}
      {/* Close the p-5 flex-1 flex flex-col div */}
    </article>
  );
}

export default CourseCardItem;
