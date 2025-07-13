"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MarketLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Studdy Buddy Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-semibold text-lg">Studdy Buddy</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/marketplace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Studdy Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
