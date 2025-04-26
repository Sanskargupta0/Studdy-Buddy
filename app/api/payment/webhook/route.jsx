import { db } from "@/configs/db";
import { PAYMENT_RECORD_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let data;
  let eventType;
  
  try {
  const payload = await req.json();
  data = payload.data;
  eventType = payload.type;
    
    console.log(`Processing webhook: ${eventType}`);

  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      const customerEmail = data.object.customer_details.email;
      const customerId = data.object.customer;

        console.log(`Activating subscription for: ${customerEmail}`);

        try {
      const result = await db
        .update(USER_TABLE)
        .set({
          isMember: true,
          customerId: customerId,
        })
            .where(eq(USER_TABLE.email, customerEmail))
            .returning({ 
              id: USER_TABLE.id,
              email: USER_TABLE.email,
              isMember: USER_TABLE.isMember 
            });

          console.log("User subscription activated:", result);
        } catch (dbError) {
          console.error("Database error updating user:", dbError);
        }
      break;
        
    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
        const paidCustomerId = data.object.customer;
        
        try {
          // Make sure user stays as member when invoice is paid
          await db
            .update(USER_TABLE)
            .set({ isMember: true })
            .where(eq(USER_TABLE.customerId, paidCustomerId));
            
          // Record payment
      await db.insert(PAYMENT_RECORD_TABLE).values({
            customerId: paidCustomerId,
            sessionId: data.object.subscription,
      });
        } catch (dbError) {
          console.error("Database error recording payment:", dbError);
        }
      break;
        
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
        const failedCustomerId = data.object.customer;
        
        try {
      await db
        .update(USER_TABLE)
            .set({ isMember: false })
            .where(eq(USER_TABLE.customerId, failedCustomerId));
        } catch (dbError) {
          console.error("Database error updating user after payment failure:", dbError);
        }
      break;
        
    case "customer.subscription.deleted":
      // Subscription is canceled or expired
        const deletedCustomerId = data.object.customer;
        
        try {
      await db
        .update(USER_TABLE)
            .set({ isMember: false })
            .where(eq(USER_TABLE.customerId, deletedCustomerId));
        } catch (dbError) {
          console.error("Database error updating user after subscription deletion:", dbError);
        }
      break;
        
    default:
        console.log(`Unhandled event type: ${eventType}`);
  }

  return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
