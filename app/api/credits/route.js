import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


// Use a credit
export async function POST(req) {
  try {
    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    // Get current user
    const user = await db
      .select()
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, email));
      
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const currentUser = user[0];

    // send current credits
    return NextResponse.json({
      remainingCredits: currentUser.credits,
      isMember: currentUser.isMember,
    });
    
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch user credits" },
      { status: 500 }
    );
  }
} 