import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Function to create a URL-friendly slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export async function POST(req) {
  try {
    const { studyMaterialId } = await req.json();
    
    if (!studyMaterialId) {
      return NextResponse.json(
        { error: "Study material ID is required" },
        { status: 400 }
      );
    }
    
    // Get the study material
    const studyMaterial = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId));
    
    if (!studyMaterial || studyMaterial.length === 0) {
      return NextResponse.json(
        { error: "Study material not found" },
        { status: 404 }
      );
    }
    
    // Generate a unique slug
    const baseSlug = slugify(studyMaterial[0].topic);
    const uniqueSlug = `${baseSlug}-${studyMaterialId}`;
    
    // Update the study material
    await db
      .update(STUDY_MATERIAL_TABLE)
      .set({
        isPublic: true,
        publicSlug: uniqueSlug
      })
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId));
    
    return NextResponse.json({
      success: true,
      publicSlug: uniqueSlug,
      message: "Study material published successfully"
    });
  } catch (error) {
    console.error("Error publishing study material:", error);
    return NextResponse.json(
      { error: "Failed to publish study material" },
      { status: 500 }
    );
  }
} 