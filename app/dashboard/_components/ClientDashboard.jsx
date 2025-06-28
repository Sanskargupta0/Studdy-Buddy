"use client";

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

// Dynamically import components with no SSR to avoid hydration mismatches
const WelcomeBanner = dynamic(() => import("./WelcomeBanner"), { 
  ssr: false,
  loading: () => <WelcomeBannerSkeleton />
});

const CourseList = dynamic(() => import("./CourseList"), { 
  ssr: false,
  loading: () => <CourseListSkeleton />
});

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full p-6">
          <Alert variant="destructive" className="max-w-3xl mx-auto">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p>We couldn't load the dashboard. This might be a temporary issue.</p>
              <div>
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 text-sm font-medium bg-transparent hover:bg-accent/80 transition-colors px-3 py-1.5 rounded-md border border-border"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Skeleton components for loading states
function WelcomeBannerSkeleton() {
  return (
    <div className="w-full p-6 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-xl mb-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-3/4 mb-6" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CourseListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function ClientDashboard() {
  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <Suspense fallback={<WelcomeBannerSkeleton />}>
          <WelcomeBanner />
        </Suspense>
        
        <Suspense fallback={<CourseListSkeleton />}>
          <CourseList />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default React.memo(ClientDashboard);
