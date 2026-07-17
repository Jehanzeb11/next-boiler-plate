import { cn } from "@/utils/cn"

interface SkeletonProps {
  className?: string
}

/**
 * Generic skeleton block — use as Suspense fallbacks to avoid layout shift.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
      aria-hidden="true"
    />
  )
}
