"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebarContent } from "@/components/dashboard-sidebar-content";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // This will be covered by the AuthProvider's loading state
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <DashboardSidebarContent />
        </Sidebar>
        <SidebarInset>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
