import { db } from "@/configs/db";
import { inngest } from "./client";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import {
  generateNotesAiModel,
  GenerateQnAAiModel,
  GenerateQuizAiModel,
  GenerateStudyTypeContentAiModel,
} from "@/configs/AiModel";


export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;

    try {
      // Generate notes for each chapter with ai
      const notesResult = await step.run("Generate Chapter Notes", async () => {
        const chapters = course?.courseLayout?.chapters;

        if (!chapters || !Array.isArray(chapters)) {
          throw new Error("No chapters found in course layout");
        }

        // Use Promise.all to wait for all chapter notes to be generated
        await Promise.all(
          chapters.map(async (chapter, index) => {
            const PROMPT =
              "Generate exam material detail content for each chapter. Make sure to include all topic point in the content, make sure to give content in HTML format (DO not add HTML, Head, Body, title tag), The Chapters:" +
              JSON.stringify(chapter);

            const result = await generateNotesAiModel.sendMessage(PROMPT);
            const aiResp = await result.response.text();

            // Insert notes into CHAPTER_NOTES_TABLE
            await db.insert(CHAPTER_NOTES_TABLE).values({
              chapterId: index + 1, // Using 1-based indexing for chapters
              courseId: course?.courseId,
              notes: aiResp,
            });
          })
        );

        return "Completed";
      });

      // Update Status to ready in STUDY_MATERIAL_TABLE
      const updateCourseStatusResult = await step.run(
        "Update Course Status to Ready",
        async () => {
          await db
            .update(STUDY_MATERIAL_TABLE)
            .set({
              status: "Ready",
            })
            .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));
          return "Success";
        }
      );

      return {
        status: "success",
        notesResult,
        updateCourseStatusResult,
      };
    } catch (error) {
      console.error("Error in GenerateNotes:", error);

      // Update status to error in case of failure
      await db
        .update(STUDY_MATERIAL_TABLE)
        .set({
          status: "Error",
        })
        .where(eq(STUDY_MATERIAL_TABLE.courseId, course?.courseId));

      throw error; // Re-throw to let Inngest handle the error
    }
  }
);

//Used to generate flash cards, quiz and qna
export const GenerateStudyTypeContent = inngest.createFunction(
  { id: "Generate Study Type Content" },
  { event: "studyType.content" },

  async ({ event, step }) => {
    const { studyType, prompt, courseId, recordId } = event.data;

    const AiResult = await step.run(
      "Generating FlashCard using Ai",
      async () => {
        let result;
        if (studyType === "Flashcard") {
          result = await GenerateStudyTypeContentAiModel.sendMessage(prompt);
        } else if (studyType === "Quiz") {
          result = await GenerateQuizAiModel.sendMessage(prompt);
        } else if (studyType === "QA") {
          result = await GenerateQnAAiModel.sendMessage(prompt); // Add new condition
        } else {
          throw new Error(`Unsupported studyType: ${studyType}`);
        }
        const AIResult = JSON.parse(result.response.text());
        return AIResult;
      }
    );

    //Save the result
    const DbResult = await step.run("Save Result to DB", async () => {
      const result = await db
        .update(STUDY_TYPE_CONTENT_TABLE)
        .set({
          content: AiResult,
          status: "Ready",
        })
        .where(eq(STUDY_TYPE_CONTENT_TABLE.id, recordId));

      return "Data Inserted";
    });
  }
);
