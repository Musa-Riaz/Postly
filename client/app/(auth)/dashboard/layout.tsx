"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <DashboardSidebar />
      <SidebarInset className="bg-background">
        <main className="flex-1 overflow-auto p-6 md:p-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
