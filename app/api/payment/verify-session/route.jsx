import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/configs/db";
import { USER_TABLE, PAYMENT_RECORD_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    if (!session || (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") || session.status !== "complete") {
      return NextResponse.json({ error: "Session not completed or unpaid" }, { status: 400 });
    }

    const customerId = session.customer?.id ?? null;
    const customerEmail = session.customer?.email || session.customer_details?.email || null;

    if (!customerEmail) {
      return NextResponse.json({ error: "Customer email not found" }, { status: 400 });
    }

    // Update user membership & credits
    const updateResult = await db
      .update(USER_TABLE)
      .set({ isMember: true, customerId, credits: 999999, planType: "premium"})
      .where(eq(USER_TABLE.email, customerEmail));

    if (!updateResult || updateResult.rowCount === 0) {
      return NextResponse.json({ error: "No user found with this email in the database" }, { status: 404 });
    }

    // Ensure this payment session hasn't already been processed
    const existingPayment = await db
      .select()
      .from(PAYMENT_RECORD_TABLE)
      .where(eq(PAYMENT_RECORD_TABLE.sessionId, sessionId))
      .limit(1);

    if (existingPayment.length > 0) {
      // Already handled; avoid duplicate processing
      return NextResponse.json({ success: true, alreadyProcessed: true });
    }

    // Insert payment record atomically to keep idempotency guarantees
    await db.insert(PAYMENT_RECORD_TABLE).values({
      customerId,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error?.message }, { status: 500 });
  }
}
