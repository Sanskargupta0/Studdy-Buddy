"use client";

import { useUser } from "@clerk/nextjs";
import { GraduationCap } from "lucide-react";

function WelcomeBanner() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="w-full p-6 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-800 dark:to-indigo-800 rounded-2xl shadow-md flex items-center gap-4 text-white">
      <div className="bg-white/20 p-4 rounded-full">
        <GraduationCap className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-semibold">Welcome, {user.fullName}</h2>
        <p className="text-white/90 text-sm sm:text-base">
          Ready to continue your learning journey? Let's dive in!
        </p>
      </div>
    </div>
  );
}

export default WelcomeBanner;
