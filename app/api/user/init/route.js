import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Unified user init endpoint.
 * Accepts Clerk user credentials from the frontend (email & userName).
 * If the user does not exist it will be created with default credits (handled by DB defaults).
 * Returns the complete user record including membership and credit information.
 */
export async function POST(req) {
  try {
    const { email, userName, customerID } = await req.json();

    if (!email || !userName) {
      return NextResponse.json(
        { error: "email and userName are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, email, customerID));

    // If the user does not exist, create one with defaults
    if (user.length === 0) {
      user = await db
        .insert(USER_TABLE)
        .values({ email, userName })
        .returning();
    }

    const currentUser = user[0];

    return NextResponse.json({
      success: true,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        userName: currentUser.userName,
        isMember: currentUser.isMember,
        credits: currentUser.credits,
      },
    });
  } catch (error) {
    console.error("Error in /api/user/init:", error);
    return NextResponse.json(
      { error: "Failed to initialise user" },
      { status: 500 }
    );
  }
}
