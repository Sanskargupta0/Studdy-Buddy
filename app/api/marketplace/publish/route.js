import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, STUDY_TYPE_CONTENT_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(request) {
  try {
    const { studyMaterialId } = await request.json();

    if (!studyMaterialId) {
      return NextResponse.json(
        { error: "Study material ID is required" },
        { status: 400 }
      );
    }

    // First, get the study material to get the courseId
    const studyMaterial = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId))
      .limit(1);

    if (!studyMaterial || studyMaterial.length === 0) {
      return NextResponse.json(
        { error: "Study material not found" },
        { status: 404 }
      );
    }

    const courseId = studyMaterial[0].courseId;

    // Check if all required content types (QA, Quiz, Flashcards) are generated
    const requiredContentTypes = ['QA', 'Quiz', 'Flashcard'];
    const existingContent = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.status, "Ready")
        )
      );

    // Check which content types are missing or not ready
    const existingTypes = existingContent.map(content => content.type);
    const missingTypes = requiredContentTypes.filter(type => !existingTypes.includes(type));

    if (missingTypes.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot publish course. The following content must be generated first: ${missingTypes.join(', ')}`,
          missingContent: missingTypes
        },
        { status: 400 }
      );
    }

    // Check if any of the required content is still generating
    const generatingContent = await db
      .select()
      .from(STUDY_TYPE_CONTENT_TABLE)
      .where(
        and(
          eq(STUDY_TYPE_CONTENT_TABLE.courseId, courseId),
          eq(STUDY_TYPE_CONTENT_TABLE.status, "Generating")
        )
      );

    const generatingTypes = generatingContent
      .filter(content => requiredContentTypes.includes(content.type))
      .map(content => content.type);

    if (generatingTypes.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot publish course. The following content is still being generated: ${generatingTypes.join(', ')}. Please wait for generation to complete.`,
          generatingContent: generatingTypes
        },
        { status: 400 }
      );
    }

    // Generate a unique slug for public access
    const publicSlug = nanoid(10);

    // Update the study material to make it public and assign a slug
    const updatedMaterial = await db
      .update(STUDY_MATERIAL_TABLE)
      .set({
        isPublic: true,
        publicSlug: publicSlug,
      })
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId))
      .returning();

    if (!updatedMaterial || updatedMaterial.length === 0) {
      return NextResponse.json(
        { error: "Failed to update study material" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      publicSlug: publicSlug,
      message: "Study material published successfully",
    });
  } catch (error) {
    console.error("Error publishing study material:", error);
    return NextResponse.json(
      { error: "Failed to publish study material" },
      { status: 500 }
    );
  }
}
