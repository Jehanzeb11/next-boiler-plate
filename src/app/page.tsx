import { Suspense } from "react"
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  Plus,
  Download,
  Activity,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ProductGrid } from "@/features/products/components/product-grid"
import { ProductGridSkeleton } from "@/features/products/components/product-grid-skeleton"
import { AddProductDialog } from "@/features/products/components/add-product-dialog"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-zinc-950 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/10 border border-purple-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 border border-purple-400/30 text-xs px-3 py-0.5 rounded-full backdrop-blur-md">
                <Sparkles className="h-3 w-3 mr-1 text-purple-300" />
                Enterprise Panel v2.0
              </Badge>
              <span className="text-xs text-purple-300 font-medium">Real-Time Operational System</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, Admin 👋
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/80 leading-relaxed">
              Your store catalog performance is up <span className="font-semibold text-emerald-300">+14.2%</span> this month. Review live inventory, metrics, and team access.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button variant="outline" size="sm" className="rounded-xl border-white/20 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold">
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download Report
            </Button>
            <AddProductDialog>
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/30 hover:opacity-95">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New Item
              </Button>
            </AddProductDialog>
          </div>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5 transition-all group">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Gross Revenue</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">$48,290.00</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                +14.2% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">vs. $42,300 previous period</p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all group">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Users</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">2,840</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                +8.1% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">+210 new active accounts</p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-0.5 transition-all group">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Catalog Products</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">240</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/40">
                Active <Layers className="h-3 w-3 ml-0.5" />
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Across 4 major categories</p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all group">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Conversion Rate</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">3.42%</span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                +0.5% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Optimal store conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Recharts Analytics Charts */}
      <DashboardCharts />

      {/* Product Catalog Highlights Showcase */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              Inventory Catalog Highlights
            </h2>
            <p className="text-xs text-zinc-500">
              Live items currently streaming from the backend catalog service
            </p>
          </div>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  )
}
