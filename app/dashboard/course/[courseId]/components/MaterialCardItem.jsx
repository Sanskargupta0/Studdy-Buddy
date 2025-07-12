import { Button } from "@/components/ui/button";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const MaterialCardItem = ({ item, studyTypeContent, course, refreshData }) => {
  const [loading, setLoading] = useState(false);

  const isContentReady = () => {
    if (!studyTypeContent) return false;

    const content = studyTypeContent[item.type.toLowerCase()];
    if (!content) return false;

    // For notes, check if array has items
    if (item.type === "notes") {
      return content.length > 0;
    }

    // For other types, check if array has items and they have content
    return content.length > 0 && content.some((item) => item.content);
  };

  const GenerateContent = async (e) => {
    try {
      e.preventDefault(); // Prevent navigation
      setLoading(true);
      let chapters = "";
      course?.courseLayout?.chapters.forEach((chapter) => {
        chapters = chapter?.chapterTitle + "," + chapters;
      });
      toast("Content generation started.");
      const result = await axios.post("/api/study-type-content", {
        courseId: course?.courseId,
        type: item.type,
        chapters: chapters,
      });
      if (result?.data?.message) {
        setTimeout(() => {
          setLoading(false);
          toast.success("Content generated successfully.");
          refreshData(); // Refresh data after generation
        }, 20000);
      } else {
        toast.error("Failed to generate content.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast(
        "Error generating content: " +
          (error.response?.data?.message || error.message)
      );
      setLoading(false);
    }
  };

  const contentReady = isContentReady();

  return (
    <div className="h-full">
      <Link href={"/dashboard/course/" + course?.courseId + item.path} className="block h-full">
        <div
          className={`h-full flex flex-col border border-border bg-card rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-0.5 ${
            !contentReady ? 'opacity-80 hover:opacity-100' : 'hover:shadow-primary/10'
          }`}
        >
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-4">
            {!contentReady ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                Not Generated
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                Ready
              </span>
            )}
            
            {!contentReady && loading && (
              <RefreshCcw className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Icon */}
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="p-3 mb-4 rounded-lg bg-primary/5 dark:bg-primary/10">
              <Image 
                src={item.icon} 
                alt={item.name} 
                width={40} 
                height={40}
                className="w-10 h-10 object-contain"
              />
            </div>
            
            <h3 className="text-lg font-medium text-foreground">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            {!contentReady ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  GenerateContent(e);
                }}
                disabled={loading || studyTypeContent? false:true}
              >
                {loading ? (
                  <>
                    <RefreshCcw className="mr-2 h-3.5 w-3.5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </Button>
            ) : (
              <Button className="w-full" variant="default">
                View {item.name}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MaterialCardItem;
