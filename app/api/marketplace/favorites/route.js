import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { FAVORITES_TABLE } from "@/configs/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const { courseId, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existingFavorite = await db
      .select()
      .from(FAVORITES_TABLE)
      .where(
        and(
          eq(FAVORITES_TABLE.userId, userId),
          eq(FAVORITES_TABLE.courseId, courseId)
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      // Remove from favorites
      await db
        .delete(FAVORITES_TABLE)
        .where(
          and(
            eq(FAVORITES_TABLE.userId, userId),
            eq(FAVORITES_TABLE.courseId, courseId)
          )
        );

      return NextResponse.json({
        success: true,
        favorited: false,
        message: "Removed from favorites",
      });
    } else {
      // Add to favorites
      await db.insert(FAVORITES_TABLE).values({
        userId,
        courseId,
      });

      return NextResponse.json({
        success: true,
        favorited: true,
        message: "Added to favorites",
      });
    }
  } catch (error) {
    console.error("Error managing favorite:", error);
    return NextResponse.json(
      { error: "Failed to manage favorite" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (courseId) {
      // Check if specific course is favorited
      const favorite = await db
        .select()
        .from(FAVORITES_TABLE)
        .where(
          and(
            eq(FAVORITES_TABLE.userId, userId),
            eq(FAVORITES_TABLE.courseId, courseId)
          )
        )
        .limit(1);

      return NextResponse.json({
        success: true,
        favorited: favorite.length > 0,
      });
    } else {
      // Get all user favorites
      const favorites = await db
        .select()
        .from(FAVORITES_TABLE)
        .where(eq(FAVORITES_TABLE.userId, userId));

      return NextResponse.json({
        success: true,
        favorites: favorites.map(f => f.courseId),
      });
    }
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}
