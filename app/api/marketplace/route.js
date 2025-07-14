import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { STUDY_MATERIAL_TABLE } from "@/configs/schema";
import { eq, like, desc, asc, and, or, ilike, sql } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "newest";
    
    const offset = (page - 1) * limit;

    let whereConditions = [eq(STUDY_MATERIAL_TABLE.isPublic, true)];

    // Enhanced search functionality - search in multiple fields with fuzzy matching
    if (search) {
      const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
      const searchConditions = [];
      
      searchTerms.forEach(term => {
        searchConditions.push(
          ilike(STUDY_MATERIAL_TABLE.topic, `%${term}%`),
          ilike(STUDY_MATERIAL_TABLE.createdBy, `%${term}%`),
          ilike(STUDY_MATERIAL_TABLE.courseType, `%${term}%`),
          ilike(STUDY_MATERIAL_TABLE.difficultyLevel, `%${term}%`)
        );
      });

      if (searchConditions.length > 0) {
        whereConditions.push(or(...searchConditions));
      }
    }

    let query = db
      .select()
      .from(STUDY_MATERIAL_TABLE)
      .where(and(...whereConditions));

    // Add sorting
    switch (sortBy) {
      case "newest":
        query = query.orderBy(desc(STUDY_MATERIAL_TABLE.createdAt));
        break;
      case "oldest":
        query = query.orderBy(asc(STUDY_MATERIAL_TABLE.createdAt));
        break;
      case "popular":
        query = query.orderBy(desc(STUDY_MATERIAL_TABLE.upvotes));
        break;
      case "title":
        query = query.orderBy(asc(STUDY_MATERIAL_TABLE.topic));
        break;
      default:
        query = query.orderBy(desc(STUDY_MATERIAL_TABLE.createdAt));
    }

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql`count(*)` })
      .from(STUDY_MATERIAL_TABLE)
      .where(and(...whereConditions));

    const [publishedMaterials, totalCountResult] = await Promise.all([
      query.limit(limit).offset(offset),
      totalCountQuery
    ]);

    const totalItems = parseInt(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      success: true,
      courses: publishedMaterials,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalItems,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching published study materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch published study materials" },
      { status: 500 }
    );
  }
}
