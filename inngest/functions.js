import { db } from "@/configs/db";
import { inngest } from "./client";
import {
  CHAPTER_NOTES_TABLE,
  STUDY_MATERIAL_TABLE,
  USER_TABLE,
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { generateNotesAiModel } from "@/configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { event, body: "Hello World!" };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;

    const result = await step.run(
      "CheckUser And create new if not in DB",
      async () => {
        try {
          // Check if the user already exists
          const existingUser = await db
            .select()
            .from(USER_TABLE)
            .where(
              eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress)
            );

          if (existingUser?.length === 0) {
            // If not, then add to db with proper field names
            const userResp = await db
              .insert(USER_TABLE)
              .values({
                userName: user?.fullName || "", // Match the schema column name
                email: user?.primaryEmailAddress?.emailAddress || "",
                isMember: false,
                customerId: null,
              })
              .returning({ id: USER_TABLE.id });

            console.log("New user created:", userResp);
            return userResp;
          }

          console.log("Existing user found:", existingUser);
          return existingUser;
        } catch (error) {
          console.error("Error in CreateNewUser:", error);
          throw error; // Re-throw to let Inngest handle the error
        }
      }
    );

    return { status: "Success", userId: result[0]?.id };
  }
);

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
