"use client";
import React, { useEffect, useState } from "react";
import { Check, XCircle, AlertTriangle, Shield } from "lucide-react";
import axios from "axios";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

export default function UpgradePage() {
  return (
      <PricingPlans />
  );
}

function PricingPlans() {
  const user = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellationLoading, setCancellationLoading] = useState(false);

  useEffect(() => {
    if (user.isLoaded && user.user) {
      GetUserDetail();
    }
  }, [user.isLoaded, user.user]);

  const GetUserDetail = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(USER_TABLE)
        .where(eq(USER_TABLE.email, user.user.primaryEmailAddress?.emailAddress));
      setUserDetail(result[0]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const OnCheckoutClick = async () => {
    try {
      const result = await axios.post("/api/payment/checkout", {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      });

      if (result.data.session?.url) {
        window.location.assign(result.data.session.url);
      } else {
        console.error("No checkout URL received from Stripe");
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error during checkout. Please try again.");
    }
  };

  const OnPaymentManage = async () => {
    try {
      const result = await axios.post("/api/payment/manage-payment", {
        customerId: userDetail?.customerId,
      });

      if (result.data.portalSession?.url) {
        window.location.assign(result.data.portalSession.url);
      } else {
        toast.error("Failed to access subscription management");
      }
    } catch (error) {
      console.error("Error managing payment:", error);
      toast.error("Error accessing subscription management");
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) {
      return;
    }
    
    setCancellationLoading(true);
    try {
      // Navigate to management portal where user can cancel
      await OnPaymentManage();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    } finally {
      setCancellationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold mb-2">Your Subscription Plan</h1>
        <p className="text-sm text-gray-600">
          Manage your plan and credits for study materials
        </p>
        {userDetail && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
            {userDetail.isMember ? (
              <>
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-600">Premium Plan Active</span>
              </>
            ) : (
              <>
                <span className="font-medium">Free Plan</span>
                <span className="text-sm text-gray-500">({userDetail.credits} credits left)</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`border rounded-lg p-6 flex flex-col items-center text-center shadow-sm ${!userDetail?.isMember ? 'bg-white ring-2 ring-blue-600' : 'bg-white'}`}>
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Free</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">$0</span>
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow w-full max-w-xs">
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>2 Free Credits</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited Notes Taking</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Email support</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Help center access</span>
            </div>
          </div>

          {userDetail?.isMember === true ? (
            <button 
              className="mt-6 w-full max-w-xs py-2 px-4 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              onClick={handleCancelSubscription}
              disabled={cancellationLoading}
            >
              Downgrade to Free
            </button>
          ) : (
            <div className="mt-6 w-full max-w-xs py-2 px-4 border border-blue-600 text-blue-600 rounded-md bg-blue-50">
              Current Plan
            </div>
          )}
        </div>

        {/* Monthly Plan */}
        <div className={`border rounded-lg p-6 flex flex-col items-center text-center shadow-sm ${userDetail?.isMember ? 'bg-white ring-2 ring-blue-600' : 'bg-white'}`}>
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Premium</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">$9.99</span>
              <span className="text-sm text-gray-600 ml-1">/month</span>
            </div>
          </div>

          <div className="space-y-4 flex-grow w-full max-w-xs">
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited Study Materials</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Unlimited Notes Taking</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Priority Email support</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>Help center access</span>
            </div>
          </div>

          {userDetail?.isMember === false ? (
            <button
              className="mt-6 w-full max-w-xs py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={OnCheckoutClick}
            >
              Upgrade Now
            </button>
          ) : (
            <button
              className="mt-6 w-full max-w-xs py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={OnPaymentManage}
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>
      
      {userDetail?.isMember && (
        <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-medium mb-2">About your subscription</h3>
          <p className="text-sm text-gray-600 mb-2">
            Your premium subscription gives you unlimited access to all features. If you cancel, you'll still have access until the end of your current billing period.
          </p>
          <p className="text-sm text-gray-600">
            After that, your account will revert to the free plan with 2 free credits.
          </p>
        </div>
      )}
    </div>
  );
}