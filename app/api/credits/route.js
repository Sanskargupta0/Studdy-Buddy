import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Check user credits
export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const user = await db
      .select({
        id: USER_TABLE.id,
        isMember: USER_TABLE.isMember,
        credits: USER_TABLE.credits
      })
      .from(USER_TABLE)
      .where(eq(USER_TABLE.email, email));
      
    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      credits: user[0].credits,
      isMember: user[0].isMember
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" }, 
      { status: 500 }
    );
  }
}

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
    
    // If user is a member, don't deduct credits
    if (currentUser.isMember) {
      return NextResponse.json({ 
        success: true, 
        message: "Member access granted", 
        remainingCredits: currentUser.credits,
        isMember: true
      });
    }
    
    // If not a member and no credits left
    if (currentUser.credits <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No credits remaining", 
        remainingCredits: 0,
        isMember: false
      }, { status: 403 });
    }
    
    // Use a credit
    const updatedUser = await db
      .update(USER_TABLE)
      .set({
        credits: currentUser.credits - 1
      })
      .where(eq(USER_TABLE.email, email))
      .returning({ 
        credits: USER_TABLE.credits,
        isMember: USER_TABLE.isMember
      });
      
    return NextResponse.json({ 
      success: true, 
      message: "Credit used successfully", 
      remainingCredits: updatedUser[0].credits,
      isMember: updatedUser[0].isMember
    });
  } catch (error) {
    console.error("Error using credit:", error);
    return NextResponse.json(
      { error: "Failed to use credit" }, 
      { status: 500 }
    );
  }
} 