"use client";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard, Shield, AlertTriangle, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useUserCredits } from "@/app/_context/UserCreditsContext";
import { useZenMode } from "@/app/provider";

function SideBar() {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Marketplace",
      icon: Store,
      path: "/market",
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];

  const { totalCourse } = useContext(CourseCountContext);
  const { zenMode } = useZenMode();
  const path = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { credits, isMember, loading: creditsLoading } = useUserCredits();
  
  // Handle click on "Create New" when user has no credits
  const handleCreateNew = async (e) => {
    if (!isMember && credits <= 0) {
      e.preventDefault();
      toast.error("You have no credits left. Please upgrade to continue creating materials.", {
        action: {
          label: "Upgrade",
          onClick: () => router.push("/dashboard/upgrade"),
        },
      });
      return false;
    }
  };

  return (
    <div className={`h-screen shadow-md p-5 ${zenMode ? 'bg-gray-50' : ''}`}>
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">
          <Link href="/dashboard">Studdy Buddy</Link>
        </h2>
      </div>

      <div className="mt-10">
        <Link href={"/create"} className="w-full" onClick={handleCreateNew}>
          <Button className="w-full">+&nbsp;Create New</Button>
        </Link>
        <div className="mt-5">
          {MenuList.map((menu, index) => (
            <div
              key={index}
              className={`flex gap-5 items-center p-3 hover:bg-slate-200 rounded-lg cursor-pointer mt-3 ${
                path === menu.path && "bg-slate-200"
              }`}
            >
              <menu.icon />
              <Link href={menu.path}>{menu.name}</Link>
            </div>
          ))}
        </div>
      </div>
      
      {!creditsLoading && (
        <div className="border p-3 bg-slate-100 rounded-lg absolute bottom-10 w-[86%]">
          {isMember ? (
            // Premium member display
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-medium text-blue-600">Premium Plan</h2>
              </div>
              <p className="text-sm mb-2">Unlimited access to all features</p>
              <Link href="/dashboard/upgrade" className="text-primary text-sm block mt-2">
                Manage subscription
              </Link>
            </div>
          ) : (
            // Free plan user display
            <div>
              <h2 className="text-lg mb-3">Available Credits: {credits}</h2>
              <Progress value={(credits < 0 ? 0 : credits) / 2 * 100} />
              <h2 className="text-xs mt-1">{2 - credits} out of 2 Credits used</h2>
              {credits <= 0 && (
                <div className="flex items-center gap-1 mt-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">No credits left</span>
                </div>
              )}
              <Link href="/dashboard/upgrade" className="text-primary text-sm block mt-2">
                Upgrade to create more
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SideBar;
