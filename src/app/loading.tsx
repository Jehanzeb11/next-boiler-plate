// Route-level loading fallback — Next.js automatically wraps page.tsx in a
// Suspense boundary using this file. Shown during initial navigation to "/".
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"

export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-9 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md animate-pulse" />
        <div className="mt-2 h-4 w-72 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
      </div>
      <ProductGridSkeleton />
    </main>
  )
}
