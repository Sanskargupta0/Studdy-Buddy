"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId: courseId,
        studyType: "notes",
      });

      // No need to parse notes as JSON if it's already HTML content.
      const parsedNotes = result?.data?.notes.map((note) => ({
        ...note,
        notes: note.notes, // Directly use the HTML string.
      }));
      setNotes(parsedNotes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
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

  if (!Array.isArray(notes)) {
    return <div>No notes available</div>;
  }

  return notes.length > 0 ? (
    <div>
      <div className="flex gap-5 items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStepCount((prev) => Math.max(prev - 1, 0))}
        >
          Previous
        </Button>
        {notes.map((note, index) => {
          // Create a unique key using the note's content hash and index
          const noteKey = `note-${index}-${note.notes?.substring(0, 10)?.replace(/\s+/g, '-') || index}`;
          return (
            <div
              key={noteKey}
              className={`w-full h-2 rounded-full ${
                index <= stepCount ? "bg-primary" : "bg-gray-200"
              }`}
              aria-label={`Note ${index + 1} of ${notes.length}`}
            ></div>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setStepCount((prev) => Math.min(prev + 1, notes.length - 1))
          }
        >
          Next
        </Button>
      </div>

      <div className="mt-10">
        <div
          className="note-content"
          dangerouslySetInnerHTML={{
            __html: styleContent(notes[stepCount].notes),
          }}
        ></div>

        {stepCount === notes.length - 1 && (
          <div className="flex items-center gap-10 flex-col justify-center">
            <h2>End of notes</h2>
            <Button onClick={() => router.back()}>Go to course page</Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div>No notes available</div>
  );
}

export default function NotesWrapper() {
  return (
      <ViewNotes />
  );
}
