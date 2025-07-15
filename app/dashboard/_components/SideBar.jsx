"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LayoutDashboard, Shield, AlertTriangle, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { memo, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useApp } from "@/app/_context/AppContext";

// Memoized menu item component to prevent unnecessary re-renders
const MenuItem = memo(({ menu, isActive, onClick }) => {
  const Icon = menu.icon;

  return (
    <li key={`menu-${menu.path.toLowerCase().replace(/\//g, "")}`}>
      <Link
        href={menu.path}
        onClick={onClick}
        className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm font-medium
          ${
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-foreground/80 hover:bg-accent/50 hover:text-foreground"
          }
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span>{menu.name}</span>
      </Link>
    </li>
  );
});

MenuItem.displayName = "MenuItem";

// Main Sidebar component
function SideBar({ closeSidebar }) {
  const menuItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        name: "Marketplace",
        icon: Store,
        path: "/dashboard/marketplace",
      },
      {
        name: "Upgrade",
        icon: Shield,
        path: "/dashboard/upgrade",
      },
    ],
    []
  );

  const { credits, isMember, loading: creditsLoading, zenMode } = useApp();

  const path = usePathname();
  const router = useRouter();

  // Memoize the create new handler
  const handleCreateNew = useCallback(
    async (e) => {
      if (!isMember && credits <= 0) {
        e.preventDefault();
        toast.error(
          "You have no credits left. Please upgrade to continue creating materials.",
          {
            action: {
              label: "Upgrade",
              onClick: () => router.push("/dashboard/upgrade"),
            },
          }
        );
        return false;
      }
    },
    [isMember, credits, router]
  );

  // Memoize the logo and header to prevent re-renders
  const logoAndHeader = useMemo(
    () => (
      <div className="flex gap-2 items-center justify-between">
        <Link href="/dashboard">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={"/logo.svg"}
              alt="logo"
              width={32}
              height={32}
              className="h-8 w-auto dark:invert dark:brightness-0 dark:contrast-100 transition-all duration-300"
            />
            <span className="ml-2 text-xl font-bold text-foreground">
              StuddyBuddy
            </span>
          </div>
        </Link>
        {closeSidebar && (
          <button
            className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-colors md:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
              aria-hidden="true"
            >
              <title>Close menu</title>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    ),
    [closeSidebar]
  );

  // Memoize the create button
  const createButton = useMemo(
    () => (
      <div className="mb-4">
        <Link
          href={"/dashboard/create"}
          className="w-full block"
          onClick={handleCreateNew}
          aria-label="Create new course"
        >
          <Button className="w-full h-10 text-sm font-medium">
            <span className="mr-1">+</span> Create New
          </Button>
        </Link>
      </div>
    ),
    [handleCreateNew]
  );

  // Memoize the menu items

  return (
    <div
      className={`h-screen flex flex-col shadow-sm bg-background/95 backdrop-blur-sm border-r border-border overflow-hidden transition-colors duration-200 ${
        zenMode ? "dark:bg-gray-900/95" : ""
      }`}
      aria-label="Sidebar navigation"
    >
      <div className="p-5 pb-4">
        {logoAndHeader}
        <nav className="mt-8" aria-label="Main navigation">
          <ul className="space-y-2">
            {menuItems.map((menu) => (
              <MenuItem
                key={menu.path}
                menu={menu}
                isActive={path === menu.path}
                onClick={closeSidebar}
              />
            ))}
          </ul>
        </nav>
      </div>

      <div className="p-5 pt-0 mt-auto">
        {createButton}

        {!creditsLoading && (
          <div className="border border-border p-4 bg-card/80 backdrop-blur-sm rounded-lg mt-auto mb-6 text-card-foreground shadow-sm">
            {isMember ? (
              // Premium member display
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield
                    className="h-5 w-5 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <h2 className="text-base font-medium text-primary">
                    Premium Plan
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Unlimited access to all features
                </p>
                <Link
                  href="/dashboard/upgrade"
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  aria-label="Manage your premium subscription"
                  onClick={closeSidebar}
                >
                  Manage subscription
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-3.5 w-3.5 flex-shrink-0"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            ) : (
              // Free plan user display
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">
                  Available Credits
                </h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl font-bold">{credits}</span>
                </div>
                <Progress
                  value={(Math.max(0, credits) / 2) * 100}
                  className="h-2 bg-muted"
                  aria-label={`${credits} out of 2 credits used`}
                />

                {credits <= 0 && (
                  <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md flex items-start gap-2">
                    <AlertTriangle
                      className="h-4 w-4 mt-0.5 text-amber-500 dark:text-amber-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      You've used all your credits. Upgrade for unlimited
                      access.
                    </p>
                  </div>
                )}

                <Link
                  href="/dashboard/upgrade"
                  className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  aria-label="Upgrade to premium"
                >
                  Upgrade for more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Wrap the component with React.memo for performance optimization
export default memo(SideBar);
