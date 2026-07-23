"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  badge,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h1>
          {badge && (
            <Badge className="bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
