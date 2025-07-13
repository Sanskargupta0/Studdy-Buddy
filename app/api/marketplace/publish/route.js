import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
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
