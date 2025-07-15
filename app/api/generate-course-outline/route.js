import { courseOutlineAIModel, createCourseOutlinePrompt } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { courseId, topic, courseType, difficultyLevel, createdBy } =
      await req.json();

    if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user is a member or has credits
    const user = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, createdBy));

    if (user.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentUser = user[0];

    // If not a member and no credits
    if (!currentUser.isMember && currentUser.credits <= 0) {
      return NextResponse.json(
        { error: "No credits available. Please upgrade to continue." },
        { status: 403 }
      );
    }


    const prompt = createCourseOutlinePrompt(topic, courseType, difficultyLevel);

    // Generate course layout using AI
    const aiResp = await courseOutlineAIModel.sendMessage(prompt);
    const aiResult = JSON.parse(aiResp.response.text());

     // If not a member, use a credit
    if (!currentUser.isMember) {
      await db
        .update(USER_TABLE)
        .set({
          credits: currentUser.credits - 1
        })
        .where(eq(USER_TABLE.email, createdBy));
    }

    // Save result along with user input
    const dbResult = await db
      .insert(STUDY_MATERIAL_TABLE)
      .values({
        courseId: courseId,
        courseType: courseType,
        difficultyLevel: difficultyLevel,
        topic: topic,
        createdBy: createdBy,
        courseLayout: aiResult,
      })
      .returning({ resp: STUDY_MATERIAL_TABLE });

    //Trigger Inngest function to generate chapter notes
    const result = await inngest.send({
      name: "notes.generate",
      data: {
        course: dbResult[0].resp,
      },
    });

    // Return the remaining credits for the user
    const updatedUser = await db
      .select({
        credits: USER_TABLE.credits,
        isMember: USER_TABLE.isMember
      })
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, createdBy));

    return NextResponse.json({ 
      result: dbResult[0],
      credits: updatedUser[0].credits,
      isMember: updatedUser[0].isMember
    });
  } catch (error) {
    console.error("Error in generate-course-outline:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
