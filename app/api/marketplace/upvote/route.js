import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE, USER_UPVOTES_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const { studyMaterialId, userId } = await request.json();

    if (!studyMaterialId || !userId) {
      return NextResponse.json(
        { error: "Study material ID and user ID are required" },
        { status: 400 }
      );
    }

    // Convert studyMaterialId to number if it's a string
    const materialId = parseInt(studyMaterialId);
    if (isNaN(materialId)) {
      return NextResponse.json(
        { error: "Invalid study material ID" },
        { status: 400 }
      );
    }

    // Check if user has already upvoted this material
    const existingUpvote = await db
      .select()
      .from(USER_UPVOTES_TABLE)
      .where(
        and(
          eq(USER_UPVOTES_TABLE.userId, userId),
          eq(USER_UPVOTES_TABLE.studyMaterialId, materialId)
        )
      )
      .limit(1);

    // Get the current study material
    const studyMaterial = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.id, materialId))
      .limit(1);

    if (!studyMaterial || studyMaterial.length === 0) {
      return NextResponse.json(
        { error: "Study material not found" },
        { status: 404 }
      );
    }

    const currentUpvotes = studyMaterial[0].upvotes || 0;

    if (existingUpvote.length > 0) {
      // User has already upvoted, so remove the upvote
      await db
        .delete(USER_UPVOTES_TABLE)
        .where(
          and(
            eq(USER_UPVOTES_TABLE.userId, userId),
            eq(USER_UPVOTES_TABLE.studyMaterialId, materialId)
          )
        );

      // Decrement the upvotes count
      const updatedMaterial = await db
        .update(STUDY_MATERIAL_TABLE)
        .set({
          upvotes: Math.max(0, currentUpvotes - 1),
        })
        .where(eq(STUDY_MATERIAL_TABLE.id, materialId))
        .returning();

      return NextResponse.json({
        success: true,
        upvotes: updatedMaterial[0].upvotes,
        isUpvoted: false,
        message: "Upvote removed",
      });
    } else {
      // User hasn't upvoted, so add the upvote
      await db.insert(USER_UPVOTES_TABLE).values({
        userId,
        studyMaterialId: materialId,
      });

      // Increment the upvotes count
      const updatedMaterial = await db
        .update(STUDY_MATERIAL_TABLE)
        .set({
          upvotes: currentUpvotes + 1,
        })
        .where(eq(STUDY_MATERIAL_TABLE.id, materialId))
        .returning();

      return NextResponse.json({
        success: true,
        upvotes: updatedMaterial[0].upvotes,
        isUpvoted: true,
        message: "Upvoted successfully",
      });
    }
  } catch (error) {
    console.error("Error managing upvote:", error);
    return NextResponse.json(
      { error: "Failed to manage upvote" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has upvoted
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const studyMaterialId = searchParams.get("studyMaterialId");

    if (!userId || !studyMaterialId) {
      return NextResponse.json(
        { error: "User ID and study material ID are required" },
        { status: 400 }
      );
    }

    // Convert studyMaterialId to number if it's a string
    const materialId = parseInt(studyMaterialId);
    if (isNaN(materialId)) {
      return NextResponse.json(
        { error: "Invalid study material ID" },
        { status: 400 }
      );
    }

    const upvote = await db
      .select()
      .from(USER_UPVOTES_TABLE)
      .where(
        and(
          eq(USER_UPVOTES_TABLE.userId, userId),
          eq(USER_UPVOTES_TABLE.studyMaterialId, materialId)
        )
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      isUpvoted: upvote.length > 0,
    });
  } catch (error) {
    console.error("Error checking upvote status:", error);
    return NextResponse.json(
      { error: "Failed to check upvote status" },
      { status: 500 }
    );
  }
}
