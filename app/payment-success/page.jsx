"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useAppState } from "../_context/AppStateContext";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");
  const sessionId = searchParams.get("session_id");
  const { refreshCredits } = useAppState();

  useEffect(() => {
    if (sessionId) {
      setStatus("success");

      refreshCredits();

      const refreshInterval = setInterval(() => {
        refreshCredits();
      }, 2000);

      const timer = setTimeout(() => {
        clearInterval(refreshInterval);
        router.push("/dashboard");
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(refreshInterval);
      };
    }
  }, [sessionId, router, refreshCredits]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-6">
            Thank you for subscribing to Studdy Buddy Premium. You now have
            unlimited access to all features.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to your dashboard in a few seconds...
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
