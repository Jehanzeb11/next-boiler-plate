import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

/**
 * Generic skeleton block — use as Suspense fallbacks to avoid layout shift.
 * Match the height/width of the real content to keep CLS near zero.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800", className)}
      aria-hidden="true"
    />
  )
}
