import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { USER_TABLE, PAYMENT_RECORD_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    // Get user info
    const users = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, email));
    const user = users[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // NOTE: We intentionally keep historical payment records so that a previous checkout `sessionId`
    // cannot be reused to re-upgrade the account after a downgrade.
    // If you need to revoke access, handle it via subscription status on Stripe instead of deleting
    // `paymentRecord` rows.

    // Cancel Stripe subscription if customerId exists
    if (user.customerId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      // Find active subscriptions for this customer
      const subscriptions = await stripe.subscriptions.list({ customer: user.customerId, status: 'active', limit: 1 });
      if (subscriptions.data.length > 0) {
        const subscriptionId = subscriptions.data[0].id;
        await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
      }
    }
    // Downgrade user
    await db
      .update(USER_TABLE)
      .set({ isMember: false, planType: "free", credits: 2 })
      .where(eq(USER_TABLE.email, email));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error downgrading user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 