import DashboardLayoutClient from "./_components/DashboardLayoutClient";
import { ClerkProvider } from "@clerk/nextjs";

export default function DashboardLayout({ children }) {
  return (
    <ClerkProvider dynamic={true}>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </ClerkProvider>
  );
}
