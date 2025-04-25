"use client";
import { CourseCountContext } from "@/app/_context/CourseCountContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard, Shield, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function SideBar() {
  const MenuList = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];

  const { totalCourse, setTotalCourse } = useContext(CourseCountContext);
  const path = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [userCredits, setUserCredits] = useState(null);
  const [isMember, setIsMember] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchUserCredits();
    }
  }, [user]);
  
  const fetchUserCredits = async () => {
    try {
      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        const response = await axios.get(`/api/credits?email=${email}`);
        setUserCredits(response.data.credits);
        setIsMember(response.data.isMember);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };
  
  const handleCreateNew = async (e) => {
    if (!isMember && userCredits <= 0) {
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
    <div className="h-screen shadow-md p-5">
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
                path == menu.path && "bg-slate-200"
              }`}
            >
              <menu.icon />
              <a href={menu.path}>{menu.name}</a>
            </div>
          ))}
        </div>
      </div>
      
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
            <h2 className="text-lg mb-3">Available Credits: {userCredits}</h2>
            <Progress value={(userCredits < 0 ? 0 : userCredits) / 2 * 100} />
            <h2 className="text-xs mt-1">{2 - userCredits} out of 2 Credits used</h2>
            {userCredits <= 0 && (
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
    </div>
  );
}

export default SideBar;
