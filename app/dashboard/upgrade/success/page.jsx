"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../../_context/AppContext";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const sessionId = searchParams.get("session_id");
  const { refreshUser } = useApp();

  // Verify session with server and update DB
  useEffect(() => {
    const verify = async () => {
      if (!sessionId) return;
      try {
        const res = await fetch("/api/payment/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Verification failed");
        }
        setStatus("success");
        refreshUser();
      } catch (err) {
        console.error(err);
        toast.error("Payment verification failed. Contact support.");
        setStatus("failed");
      }
    };
    verify();
  }, [sessionId, refreshUser]);

  // Redirect after delay when success
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);
    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {status === "processing" && (
          <div className="animate-pulse text-center">
            <p className="text-gray-600 dark:text-gray-300">Verifying your payment...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for subscribing to Studdy Buddy Premium. You now have unlimited access to all features.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Redirecting to your dashboard shortly...
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">Payment verification failed. Please contact support.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-pulse text-gray-600 dark:text-gray-300">Loading...</div></div>}>
      <PaymentContent />
    </Suspense>
  );
}
