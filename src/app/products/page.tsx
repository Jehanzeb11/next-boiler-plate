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
          <Button size="sm" className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20">
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </Button>
        </AddProductDialog>
      </PageHeader>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or category..."
            className="pl-9 h-9 text-xs rounded-xl border-border"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Badge className="bg-primary text-primary-foreground cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            All Items
          </Badge>
          <Badge variant="outline" className="text-muted-foreground hover:bg-accent cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Electronics
          </Badge>
          <Badge variant="outline" className="text-muted-foreground hover:bg-accent cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Jewelery
          </Badge>
          <Badge variant="outline" className="text-muted-foreground hover:bg-accent cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Men&apos;s Clothing
          </Badge>
          <Badge variant="outline" className="text-muted-foreground hover:bg-accent cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            Women&apos;s Clothing
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
