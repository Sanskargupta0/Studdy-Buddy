"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesDefaultPage() {
  const { slug } = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first chapter by default
    router.push(`/public/${slug}/notes/0`);
  }, [slug, router]);

  // Show loading state while redirecting
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-5 items-center mb-10">
        <Skeleton className="h-10 w-24" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-2 rounded-full" />
        ))}
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-4/5" />
      </div>
    </div>
  );
}