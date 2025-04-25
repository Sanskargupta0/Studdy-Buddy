import { db } from "@/configs/db";
import { PAYMENT_RECORD_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let data;
  let eventType;
  const payload = await req.json();
  data = payload.data;
  eventType = payload.type;

  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      const customerEmail = data.object.customer_details.email;
      const customerId = data.object.customer;

      const result = await db
        .update(USER_TABLE)
        .set({
          isMember: true,
          customerId: customerId,
          // Don't reset credits here - keep existing credits
        })
        .where(eq(USER_TABLE.email, customerEmail));

      console.log("User subscription activated:", customerEmail);
      break;
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      await db.insert(PAYMENT_RECORD_TABLE).values({
        customerId: data.object.customer, // Stripe customer ID
        sessionId: data.object.subscription, // Stripe subscription ID
      });
      break;
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      await db
        .update(USER_TABLE)
        .set({
          isMember: false,
          // Don't modify credits on payment failure
        })
        .where(eq(USER_TABLE.customerId, data.object.customer));
      break;
    case "customer.subscription.deleted":
      // Subscription is canceled or expired
      await db
        .update(USER_TABLE)
        .set({
          isMember: false,
          // Don't modify credits when subscription ends
        })
        .where(eq(USER_TABLE.customerId, data.object.customer));
      break;
    default:
    // Unhandled event type
  }

  return NextResponse.json({ received: true });
}
