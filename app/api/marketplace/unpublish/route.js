import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_UPVOTES_TABLE, FAVORITES_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  try {
    const { studyMaterialId, userId } = await request.json();

    if (!studyMaterialId || !userId) {
      return NextResponse.json(
        { error: "Study material ID and user ID are required" },
        { status: 400 }
      );
    }

    // First, verify the user owns this study material
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

    // Update the study material to make it private
    const updatedMaterial = await db
      .update(STUDY_MATERIAL_TABLE)
      .set({
        isPublic: false,
        publicSlug: null,
        upvotes: 0, // Reset upvotes
      })
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId))
      .returning();

    if (!updatedMaterial || updatedMaterial.length === 0) {
      return NextResponse.json(
        { error: "Failed to unpublish study material" },
        { status: 500 }
      );
    }

    // Remove all upvotes for this study material
    await db
      .delete(USER_UPVOTES_TABLE)
      .where(eq(USER_UPVOTES_TABLE.studyMaterialId, studyMaterialId));

    // Remove from all users' favorites
    await db
      .delete(FAVORITES_TABLE)
      .where(eq(FAVORITES_TABLE.courseId, studyMaterial[0].courseId));

    return NextResponse.json({
      success: true,
      message: "Study material unpublished successfully. All upvotes and favorites have been removed.",
    });
  } catch (error) {
    console.error("Error unpublishing study material:", error);
    return NextResponse.json(
      { error: "Failed to unpublish study material" },
      { status: 500 }
    );
  }
}
