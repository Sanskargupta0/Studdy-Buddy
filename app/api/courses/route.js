import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { createdBy, page = 1, limit = 6 } = await req.json();

  // Convert page and limit to numbers and validate
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(50, parseInt(limit) || 6)); // Max 50 items per page
  const offset = (pageNum - 1) * limitNum;

  try {
    // Get total count for pagination info
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy));
    
    const totalItems = parseInt(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Get paginated results
    const result = await db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(eq(STUDY_MATERIAL_TABLE.createdBy, createdBy))
      .orderBy(desc(STUDY_MATERIAL_TABLE.id))
      .limit(limitNum)
      .offset(offset);

    return NextResponse.json({ 
      result: result,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const courseId = searchParams.get("courseId");
  const course = await db
    .select()
    .from(STUDY_MATERIAL_TABLE)
    .where(eq(STUDY_MATERIAL_TABLE?.courseId, courseId));

  return NextResponse.json({ result: course[0] });
}
