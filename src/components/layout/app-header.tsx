"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Search,
  Bell,
  ChevronRight,
  CheckCheck,
  Package,
  ShieldAlert,
  UserPlus,
  Clock,
  Sparkles,
} from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const sampleNotifications = [
  {
    id: "1",
    title: "New Inventory Restock",
    desc: "20 units of Wireless Earbuds added.",
    time: "5m ago",
    icon: Package,
    unread: true,
    color: "text-purple-500 bg-purple-100 dark:bg-purple-950/60",
  },
  {
    id: "2",
    title: "User Role Elevated",
    desc: "Sarah Chen assigned Manager role.",
    time: "1h ago",
    icon: UserPlus,
    unread: true,
    color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-950/60",
  },
  {
    id: "3",
    title: "Security Telemetry Alert",
    desc: "Successful admin session login.",
    time: "3h ago",
    icon: ShieldAlert,
    unread: false,
    color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-950/60",
  },
]

export function AppHeader() {
  const pathname = usePathname()
  const [notifications, setNotifications] = React.useState(sampleNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard"
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return "Dashboard"
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" />
            }
          />
          <TooltipContent side="bottom" className="text-xs">
            Toggle Sidebar (⌘B)
          </TooltipContent>
        </Tooltip>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline-block">
            Panel
          </span>
          <ChevronRight className="h-4 w-4 text-zinc-400 hidden sm:inline-block" />
          <span className="text-zinc-900 dark:text-white font-semibold capitalize">
            {getPageTitle()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Quick Search Input */}
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search catalog, users..."
            className="pl-9 pr-12 h-9 text-xs rounded-xl bg-zinc-100/80 dark:bg-zinc-900/80 border-transparent focus:border-purple-500 dark:focus:border-purple-500 focus:bg-white dark:focus:bg-zinc-900 transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Notifications Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
                )}
              </Button>
            }
          />
          <PopoverContent className="w-80 p-4 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl" align="end" sideOffset={8}>
            <PopoverHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <PopoverTitle className="text-sm font-bold text-zinc-900 dark:text-white">
                  Notifications
                </PopoverTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 text-[10px] px-2 py-0.5 rounded-full border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={markAllRead}
                  className="text-[11px] text-purple-600 hover:text-purple-700 dark:text-purple-400 h-7 px-2"
                >
                  <CheckCheck className="h-3 w-3 mr-1" /> Mark read
                </Button>
              )}
            </PopoverHeader>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 py-1 max-h-72 overflow-y-auto">
              {notifications.map((n) => {
                const IconComponent = n.icon
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 py-3 px-1 transition-colors ${
                      n.unread ? "bg-purple-50/40 dark:bg-purple-950/20 rounded-xl" : ""
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 flex items-center shrink-0">
                          <Clock className="h-2.5 w-2.5 mr-0.5" />
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator className="my-2" />
            <Button variant="ghost" className="w-full text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white h-8 rounded-xl">
              View all system alerts
            </Button>
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-1">
          <Avatar className="h-8 w-8 ring-2 ring-purple-500/20">
            <AvatarFallback className="bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-xs font-bold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight">
              Admin User
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
