import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  try {
    // Get the slug from the URL
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Fetch the study material by public slug
    const publishedMaterial = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.publicSlug, slug))
      .limit(1);

    if (!publishedMaterial || publishedMaterial.length === 0) {
      return NextResponse.json(
        { error: "Published study material not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course: publishedMaterial[0],
    });
  } catch (error) {
    console.error("Error fetching published study material:", error);
    return NextResponse.json(
      { error: "Failed to fetch published study material" },
      { status: 500 }
    );
  }
}
