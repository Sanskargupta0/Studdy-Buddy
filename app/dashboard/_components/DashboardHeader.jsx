"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function DashboardHeader() {
  const pathname = usePathname();
  const isDashboardRoute = pathname === "/dashboard";

  // Condition to check whether we should show both the logo + name and the user button
  const showLogoAndName = !(isDashboardRoute && window.innerWidth >= 768); // Only hide logo on medium screen (md) on /dashboard route

  return (
    <div
      className={`w-full p-3 shadow-md flex items-center ${
        showLogoAndName ? "justify-between" : "justify-end" // Adjust layout based on whether both are shown
      }`}
    >
      {/* Logo and Name - shown based on screen size and route */}
      {showLogoAndName && (
        <div className="flex items-center space-x-2">
          <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          <Link href={"/dashboard"}>
            <span className="text-xl md:text-2xl font-bold">Studdy Buddy</span>
          </Link>
        </div>
      )}

      {/* User Button */}
      <UserButton />
    </div>
  );
}

export default DashboardHeader;
