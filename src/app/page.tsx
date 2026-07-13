import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductGridSkeleton } from "@/components/products/product-grid-skeleton"

// Server Component — no "use client".
// The page shell (heading, etc.) renders instantly as part of the static shell.
// <ProductGrid> streams in once the fakestoreapi fetch resolves.
export default function HomePage() {
  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Static shell — painted immediately */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Products
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Fetched server-side from{" "}
          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            fakestoreapi.com
          </a>
          . Data cached and revalidated every 60 seconds.
        </p>
      </div>

      {/* Suspense boundary — skeleton shows while ProductGrid awaits the API.
          ProductGrid is an async Server Component so it streams in when ready. */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </main>
  )
}
