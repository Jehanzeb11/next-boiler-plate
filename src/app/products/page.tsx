import type { Metadata } from "next"
import { Suspense } from "react"
import { Plus, Search } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ProductGrid } from "@/features/products/components/product-grid"
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton"
import { AddProductDialog } from "@/features/products/components/add-product-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { APP_NAME } from "@/constants"

export const metadata: Metadata = {
  title: `Products — ${APP_NAME}`,
  description: "Browse and manage product inventory.",
}

export default function ProductsPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Products Catalog"
        description="Comprehensive view of all store inventory, prices, and ratings."
        badge="Inventory"
      >
        <AddProductDialog>
          <Button size="sm" className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </AddProductDialog>
      </PageHeader>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by title or category..."
            className="pl-9 h-9 text-xs rounded-xl border-zinc-200 dark:border-zinc-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Badge className="bg-purple-600 text-white cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            All Items
          </Badge>
          <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Electronics
          </Badge>
          <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Jewelery
          </Badge>
          <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Men's Clothing
          </Badge>
          <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Women's Clothing
          </Badge>
        </div>
      </div>

      {/* Main Grid */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  )
}
