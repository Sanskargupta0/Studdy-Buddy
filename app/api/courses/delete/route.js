import { db } from "@/configs/db";
import {
  STUDY_MATERIAL_TABLE,
  CHAPTER_NOTES_TABLE,
  STUDY_TYPE_CONTENT_TABLE,
  YOUTUBE_RECOMMENDATIONS_TABLE
} from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { courseId, email } = await req.json();
    if (!courseId || !email) {
      return NextResponse.json({ error: "Missing courseId or email" }, { status: 400 });
    }

    // Check if the course exists and get the creator
    const course = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));
    if (!course.length) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course[0].createdBy !== email) {
      return NextResponse.json({ error: "You are not allowed to delete this course" }, { status: 403 });
    }

    // Delete related data
    await db.delete(CHAPTER_NOTES_TABLE).where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
    await db.delete(STUDY_TYPE_CONTENT_TABLE).where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
    await db.delete(YOUTUBE_RECOMMENDATIONS_TABLE).where(eq(YOUTUBE_RECOMMENDATIONS_TABLE.courseId, courseId));
    await db.delete(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE.courseId, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
} 