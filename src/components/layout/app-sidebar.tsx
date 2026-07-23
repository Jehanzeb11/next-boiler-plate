"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Bell,
  SlidersHorizontal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { APP_NAME } from "@/constants"
import { LogoutButton } from "@/features/auth/components/logout-button"

const navMain = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
        badge: "Live",
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Products",
        url: "/products",
        icon: Package,
        badge: "20+",
      },
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-between px-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white leading-none">
              {APP_NAME}
            </span>
            <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 tracking-wider uppercase mt-1">
              Enterprise Panel
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 space-y-6">
        {navMain.map((group) => (
          <SidebarGroup key={group.title} className="px-0">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase group-data-[collapsible=icon]:hidden">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-1">
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))
                  const Icon = item.icon

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={
                          <Link href={item.url} />
                        }
                        isActive={isActive}
                        tooltip={item.title}
                        className={`w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 font-semibold"
                            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        {item.badge && (
                          <SidebarMenuBadge className={`ml-auto group-data-[collapsible=icon]:hidden text-[10px] px-1.5 py-0.5 rounded-full ${
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                          }`}>
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-200/60 dark:border-zinc-800/60 p-3">
        <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden overflow-hidden">
            <Avatar className="h-9 w-9 border border-purple-500/30">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                Admin User
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                admin@liboomers.com
              </span>
            </div>
          </div>
          <div className="shrink-0">
            <LogoutButton />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
