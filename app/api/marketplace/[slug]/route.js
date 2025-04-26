import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE, CHAPTER_NOTES_TABLE } from "@/configs/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }
    
    // Get the study material by slug
    const studyMaterial = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(
        and(
          eq(STUDY_MATERIAL_TABLE.publicSlug, slug),
          eq(STUDY_MATERIAL_TABLE.isPublic, true)
        )
      );
    
    if (!studyMaterial || studyMaterial.length === 0) {
      return NextResponse.json(
        { error: "Study material not found" },
        { status: 404 }
      );
    }
    
    const material = studyMaterial[0];
    const courseId = material.courseId;
    
    // Get study type content
    const studyTypeContent = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId));
    
    // Get chapter notes if available
    const chapterNotes = await db
      .select()
      .from(CHAPTER_NOTES_TABLE)
      .where(eq(CHAPTER_NOTES_TABLE.courseId, courseId));
    
    return NextResponse.json({
      material,
      studyTypeContent,
      chapterNotes
    });
  } catch (error) {
    console.error("Error fetching study material:", error);
    return NextResponse.json(
      { error: "Failed to fetch study material" },
      { status: 500 }
    );
  }
} 