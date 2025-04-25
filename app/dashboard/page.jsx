import { Suspense } from "react";
import ClientDashboard from "./_components/ClientDashboard";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[60vh] flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      }
    >
      <ClientDashboard />
    </Suspense>
  );
}
