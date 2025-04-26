import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { studyMaterialId } = await req.json();
    
    if (!studyMaterialId) {
      return NextResponse.json(
        { error: "Study material ID is required" },
        { status: 400 }
      );
    }
    
    // Get the current study material to check if it exists and is public
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
    
    if (!studyMaterial[0].isPublic) {
      return NextResponse.json(
        { error: "Cannot upvote non-public study material" },
        { status: 403 }
      );
    }
    
    // Increment upvotes
    await db
      .update(STUDY_MATERIAL_TABLE)
      .set({
        upvotes: (studyMaterial[0].upvotes || 0) + 1
      })
      .where(eq(STUDY_MATERIAL_TABLE.id, studyMaterialId));
    
    return NextResponse.json({
      success: true,
      message: "Upvote recorded successfully"
    });
  } catch (error) {
    console.error("Error upvoting study material:", error);
    return NextResponse.json(
      { error: "Failed to record upvote" },
      { status: 500 }
    );
  }
} 