"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

function ViewNotes() {
  const { courseId, chapterId } = useParams();
  const chapterIndex = chapterId ? parseInt(chapterId, 10) : 0;
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(chapterIndex);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });

      const parsedNotes = result?.data?.notes.map((note) => ({
        ...note,
        notes: note.notes,
      }));
      setNotes(parsedNotes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const styleContent = (content) => {
    content = content
      .replace(/^```html/g, "")
      .replace(/'''$/g, "")
      .trim();
    return content
      .replace(
        /<h3>/g,
        `<h3 style="font-size:24px; font-weight:600; color:#333; margin-bottom:10px;">`
      )
      .replace(
        /<h4>/g,
        `<h4 style="font-size:20px; font-weight:500; color:#444; margin-bottom:8px;">`
      )
      .replace(
        /<p>/g,
        `<p style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
      )
      .replace(
        /<li>/g,
        `<li style="font-size:16px; color:#555; line-height:1.6; margin-bottom:12px;">`
      );
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex gap-5 items-center mb-10">
          <Skeleton className="h-10 w-24" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-2 rounded-full" />
          ))}
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-8 w-2/3 mt-8" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    );
  }

  if (!Array.isArray(notes) || notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="p-8 border border-dashed rounded-xl">
          <h3 className="text-xl font-medium text-gray-600">No notes available</h3>
          <p className="mt-2 text-gray-500">Try refreshing or go back to the course page</p>
          <Button 
            className="mt-4"
            onClick={() => router.push(`/dashboard/course/${courseId}`)}
          >
            Go to course page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back to Course Button */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/dashboard/course/${courseId}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Back to Course
        </Button>
      </div>

      <div className="flex gap-5 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepCount((prev) => Math.max(prev - 1, 0))}
          disabled={stepCount === 0}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} /> Previous
        </Button>
        <div className="flex-1 flex gap-2">
          {notes.map((note, index) => {
            const noteKey = `note-${index}-${note.notes?.substring(0, 10)?.replace(/\s+/g, '-') || index}`;
            return (
              <div
                key={noteKey}
                className={`w-full h-2 rounded-full transition-colors duration-300 ${
                  index <= stepCount ? "bg-primary" : "bg-gray-200"
                }`}
                aria-label={`Note ${index + 1} of ${notes.length}`}
              ></div>
            );
          })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStepCount((prev) => Math.min(prev + 1, notes.length - 1))
          }
          disabled={stepCount === notes.length - 1}
          className="flex items-center gap-1"
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>

      <div className="mt-10 bg-white dark:bg-[#c5c1ba] p-6 rounded-xl shadow-sm border">
        <div
          className="note-content prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{
            __html: styleContent(notes[stepCount].notes),
          }}
        ></div>

        {stepCount === notes.length - 1 && (
          <div className="flex items-center gap-6 flex-col justify-center mt-10 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">End of notes</h2>
            <Button 
              className="px-6" 
              onClick={() => router.push(`/dashboard/course/${courseId}`)}
            >
              Go to course page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NotesWrapper() {
  return <ViewNotes />;
}
