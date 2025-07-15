import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { 
  createFlashcardPrompt, 
  createQuizPrompt, 
  createQAPrompt 
} from "@/configs/AiModel";

// Add GET method to fetch content
export async function GET(req) {
  try {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams.get("courseId");
    const type = searchParams.get("type");
    const chapterId = searchParams.get("chapterId");

    if (!courseId || !type) {
      return NextResponse.json(
        { error: "courseId and type parameters are required" },
        { status: 400 }
      );
    }

    // For notes, we need to handle chapter-specific content differently
    if (type === "notes" && chapterId !== null) {
      // For individual chapter notes, we'd fetch from CHAPTER_NOTES_TABLE
      // This is a placeholder - you might need to implement this based on your schema
      const { CHAPTER_NOTES_TABLE } = await import("@/configs/schema");

      const chapterNotes = await db
        .select()
        .from(CHAPTER_NOTES_TABLE)
        .where(
          and(
            eq(CHAPTER_NOTES_TABLE.courseId, courseId),
            eq(CHAPTER_NOTES_TABLE.chapterId, chapterId)
          )
        )
        .limit(1);

      if (chapterNotes.length > 0) {
        return NextResponse.json(chapterNotes[0]);
      } else {
        return NextResponse.json(
          { error: "Chapter notes not found" },
          { status: 404 }
        );
      }
    }

    // For other content types (flashcards, quiz, QA)
    const content = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.type, type)
        )
      )
      .limit(1);

    if (content.length > 0) {
      return NextResponse.json(content[0]);
    } else {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching study content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { chapters, courseId, type } = await req.json();

  // Handle notes generation differently
  if (type === "notes") {
    await inngest.send({
      name: "notes.generate",
      data: {
        course: {
          courseId: courseId,
          courseLayout: {
            chapters: chapters.split(",").map((chapterTitle, index) => ({
              chapterId: index + 1,
              chapterTitle: chapterTitle.trim(),
            })),
          },
        },
      },
    });

    return NextResponse.json({ message: "Notes generation started" });
  }

  // Get the appropriate prompt based on type
  const getPrompt = (type, chapters) => {
    switch (type) {
      case "Flashcard":
        return createFlashcardPrompt(chapters);
      case "Quiz":
        return createQuizPrompt(chapters);
      case "QA":
        return createQAPrompt(chapters);
      default:
        throw new Error(`Unsupported study type: ${type}`);
    }
  };

  try {
    const prompt = getPrompt(type, chapters);

    const result = await db
      .insert(STUDY_TYPE_CONTENT_TABLE)
      .values({
        courseId: courseId,
        type: type,
        status: "Generating",
      })
      .returning({
        id: STUDY_TYPE_CONTENT_TABLE.id,
      });

    await inngest.send({
      name: "studyType.content",
      data: {
        studyType: type,
        prompt: prompt,
        courseId: courseId,
        recordId: result[0].id,
      },
    });

    return NextResponse.json({
      id: result[0].id,
      message: `${type} generation started`,
    });
  } catch (error) {
    console.error(`Error generating ${type}:`, error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
