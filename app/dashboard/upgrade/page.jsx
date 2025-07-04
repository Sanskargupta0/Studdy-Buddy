"use client";
import React, { useEffect, useState } from "react";
import { Check, XCircle, AlertTriangle, Shield } from "lucide-react";
import axios from "axios";
import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useApp } from "@/app/_context/AppContext";
import { Dialog } from "@/components/ui/dialog";

export default function UpgradePage() {
  return (
      <PricingPlans />
  );
}

function PricingPlans() {
  const { credits, isMember, loading, error, refreshUser } = useApp();
  const user = useUser();
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [downgradeStatus, setDowngradeStatus] = useState("idle"); // idle | loading | success | error
  const [downgradeError, setDowngradeError] = useState("");

  const OnCheckoutClick = async () => {
    try {
      const result = await axios.post("/api/payment/checkout", {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY,
      });
      if (result.data.session?.url) {
        window.location.assign(result.data.session.url);
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error("Error during checkout. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    setDowngradeStatus("loading");
    setDowngradeError("");
    try {
      const res = await axios.post("/api/payment/downgrade", {
        email: user.user.primaryEmailAddress?.emailAddress,
      });
      if (res.data.success) {
        setDowngradeStatus("success");
        refreshUser();
      } else {
        setDowngradeStatus("error");
        setDowngradeError(res.data.error || "Failed to downgrade. Please try again.");
      }
    } catch (error) {
      setDowngradeStatus("error");
      setDowngradeError("Failed to downgrade subscription. Please try again.");
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
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
          {isMember ? (
            <>
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-600">Premium Plan Active</span>
            </>
          ) : (
            <>
              <span className="font-medium dark:text-black">Free Plan</span>
              <span className="text-sm text-gray-500 dark:text-blue-600">({credits} credits left)</span>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={`border rounded-lg p-6 flex flex-col items-center text-center shadow-sm ${!isMember ? 'bg-white dark:bg-gray-800 ring-2 ring-blue-600' : 'bg-white dark:bg-gray-800'}`}>
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Free</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">$0</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">/month</span>
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
          {isMember ? (
            <>
              <button
                className="mt-6 w-full max-w-xs py-2 px-4 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setShowDowngradeModal(true)}
                disabled={cancellationLoading}
              >
                Downgrade to Free
              </button>
              <Dialog open={showDowngradeModal} onOpenChange={setShowDowngradeModal}>
                <Dialog.Content>
                  <Dialog.Title>Downgrade to Free Plan</Dialog.Title>
                  {downgradeStatus === "idle" && (
                    <>
                      <p className="mb-4">Are you sure you want to downgrade? You'll lose access to premium features at the end of your billing period.</p>
                      <div className="flex gap-2 justify-end">
                        <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={() => setShowDowngradeModal(false)}>Cancel</button>
                        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCancelSubscription}>Confirm Downgrade</button>
                      </div>
                    </>
                  )}
                  {downgradeStatus === "loading" && (
                    <p className="text-center">Processing downgrade...</p>
                  )}
                  {downgradeStatus === "success" && (
                    <>
                      <p className="text-green-600 dark:text-green-400 mb-4">You have been downgraded to the free plan.</p>
                      <div className="flex justify-end">
                        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => setShowDowngradeModal(false)}>Close</button>
                      </div>
                    </>
                  )}
                  {downgradeStatus === "error" && (
                    <>
                      <p className="text-red-600 dark:text-red-400 mb-4">{downgradeError}</p>
                      <div className="flex gap-2 justify-end">
                        <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700" onClick={() => setShowDowngradeModal(false)}>Cancel</button>
                        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleCancelSubscription}>Try Again</button>
                      </div>
                    </>
                  )}
                </Dialog.Content>
              </Dialog>
            </>
          ) : (
            <div className="mt-6 w-full max-w-xs py-2 px-4 border border-blue-600 text-blue-600 rounded-md bg-blue-50">
              Current Plan
            </div>
          )}
        </div>
        {/* Monthly Plan */}
        <div className={`border rounded-lg p-6 flex flex-col items-center text-center shadow-sm ${isMember ? 'bg-white dark:bg-gray-800 ring-2 ring-blue-600' : 'bg-white dark:bg-gray-800'}`}>
          <div className="mb-6">
            <p className="text-base font-medium mb-2">Premium</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold">$9.99</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">/month</span>
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
          {!isMember ? (
            <button
              className="mt-6 w-full max-w-xs py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={OnCheckoutClick}
            >
              Upgrade Now
            </button>
          ) : null}
        </div>
      </div>
      {isMember && (
        <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
          <h3 className="font-medium mb-2 dark:text-gray-100">About your subscription</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Your premium subscription gives you unlimited access to all features. If you cancel, you'll still have access until the end of your current billing period.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            After that, your account will revert to the free plan with 2 free credits.
          </p>
        </div>
      )}
    </div>
  );
}