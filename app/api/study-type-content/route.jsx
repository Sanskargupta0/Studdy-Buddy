import { db } from "@/configs/db";
import { STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

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
  const getPrompt = (type) => {
    switch (type) {
      case "Flashcard":
        return `Generate the flashcard on topic: ${chapters} in JSON format with front and back content, Maximum15`;
      case "Quiz":
        return `Generate Quiz on topic: ${chapters} with questions and options along with the answer in JSON Format, (Max 10)`;
      case "QA":
        return `Generate a detailed Q&A on topic: ${chapters} in JSON format with each question and a detailed answer, Maximum10`;
      default:
        throw new Error(`Unsupported study type: ${type}`);
    }
  };

  try {
    const PROMPT = getPrompt(type);

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
        prompt: PROMPT,
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
