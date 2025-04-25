"use client";

import React from "react";
import WelcomeBanner from "./WelcomeBanner";
import CourseList from "./CourseList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ClientDashboard() {
  return (
    <div>
      <WelcomeBanner />
      <div className="flex justify-between items-center mt-4 sm:hidden">
        <Link href="/create" className="w-1/2 mr-2">
          <Button className="w-full">+&nbsp;Create New</Button>
        </Link>
      </div>
      <CourseList />
    </div>
  );
}

export default ClientDashboard;
