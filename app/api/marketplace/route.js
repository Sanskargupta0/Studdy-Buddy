import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { and, desc, eq, like } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  
  // Extract and validate parameters
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const difficultyLevel = searchParams.get("difficulty");
  const courseType = searchParams.get("courseType");
  const sortBy = searchParams.get("sortBy") || "upvotes"; // upvotes, date, relevance
  
  // Calculate offset for pagination
  const offset = (page - 1) * limit;
  
  // Build filter conditions
  let conditions = [eq(STUDY_MATERIAL_TABLE.isPublic, true)];
  
  if (search) {
    conditions.push(like(STUDY_MATERIAL_TABLE.topic, `%${search}%`));
  }
  
  if (difficultyLevel) {
    conditions.push(eq(STUDY_MATERIAL_TABLE.difficultyLevel, difficultyLevel));
  }
  
  if (courseType) {
    conditions.push(eq(STUDY_MATERIAL_TABLE.courseType, courseType));
  }
  
  // Determine sort order
  let orderBy;
  switch (sortBy) {
    case "date":
      orderBy = desc(STUDY_MATERIAL_TABLE.id); // Assuming id increases with newer entries
      break;
    case "relevance":
      // Relevance is more complex - for now just default to upvotes
      orderBy = desc(STUDY_MATERIAL_TABLE.upvotes);
      break;
    case "upvotes":
    default:
      orderBy = desc(STUDY_MATERIAL_TABLE.upvotes);
      break;
  }
  
  // Execute query
  const materials = await db
    .select({
      id: STUDY_MATERIAL_TABLE.id,
      courseId: STUDY_MATERIAL_TABLE.courseId,
      topic: STUDY_MATERIAL_TABLE.topic,
      difficultyLevel: STUDY_MATERIAL_TABLE.difficultyLevel,
      courseType: STUDY_MATERIAL_TABLE.courseType,
      createdBy: STUDY_MATERIAL_TABLE.createdBy,
      upvotes: STUDY_MATERIAL_TABLE.upvotes,
      publicSlug: STUDY_MATERIAL_TABLE.publicSlug
    })
    .from(STUDY_MATERIAL_TABLE)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);
  
  // Count total for pagination info
  const totalCountResult = await db
    .select({ count: db.fn.count() })
    .from(STUDY_MATERIAL_TABLE)
    .where(and(...conditions));
  
  const totalCount = Number(totalCountResult[0].count);
  const totalPages = Math.ceil(totalCount / limit);
  
  return NextResponse.json({
    materials,
    pagination: {
      total: totalCount,
      totalPages,
      currentPage: page,
      limit
    }
  });
} 