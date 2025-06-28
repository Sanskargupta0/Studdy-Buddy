import { Suspense } from "react";
import ClientDashboard from "./_components/ClientDashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientDashboard />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-8 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="h-9 w-full mt-4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
