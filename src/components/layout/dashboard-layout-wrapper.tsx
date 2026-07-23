"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { AppHeader } from "./app-header"

export function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Do not render sidebar/header layout on login or public auth pages
  const isAuthPage = pathname === "/login" || pathname.startsWith("/login/")

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors">
        <AppHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
