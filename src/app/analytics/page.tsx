"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { CalendarIcon, Download, Zap, Target, RefreshCw } from "lucide-react"
import { format } from "date-fns"

import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"

const weeklyData = [
  { day: "Mon", sales: 4200, visitors: 1200 },
  { day: "Tue", sales: 5800, visitors: 1600 },
  { day: "Wed", sales: 7100, visitors: 2100 },
  { day: "Thu", sales: 6400, visitors: 1850 },
  { day: "Fri", sales: 9200, visitors: 2800 },
  { day: "Sat", sales: 11400, visitors: 3400 },
  { day: "Sun", sales: 8900, visitors: 2600 },
]

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDownload = () => {
    toast.success("Telemetry report generated!", {
      description: `Report exported for period ending ${date ? format(date, "PP") : "Today"}.`,
    })
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Analytics & Insights"
        description="Detailed breakdown of sales velocity, visitor traffic, and performance telemetry."
        badge="Real-Time Telemetry"
      >
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs font-semibold">
                <CalendarIcon className="h-3.5 w-3.5 text-purple-600" />
                {date ? format(date, "PPP") : "Select Date"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0 rounded-2xl" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d)
                setPopoverOpen(false)
                toast.info(`Filtered telemetry data for ${d ? format(d, "PP") : "selected date"}`)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={handleDownload}
          size="sm"
          className="gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20"
        >
          <Download className="h-3.5 w-3.5" />
          Download Report
        </Button>
      </PageHeader>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Average Order Value</span>
              <Zap className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">$142.50</span>
              <span className="text-xs font-semibold text-emerald-600">+5.4%</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Target $135.00 reached</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Customer Retention</span>
              <Target className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">68.4%</span>
              <span className="text-xs font-semibold text-emerald-600">+3.1%</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">High repeat customer rate</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-5 shadow-sm">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Cart Checkout Rate</span>
              <RefreshCw className="h-4 w-4 text-pink-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">82.1%</span>
              <span className="text-xs font-semibold text-emerald-600">+1.8%</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">Streamlined checkout UX</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Sales Bar Chart */}
        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Weekly Sales ($)</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Daily revenue totals for the active week</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.2)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(24, 24, 27, 0.9)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                      formatter={(val: number) => [`$${val.toLocaleString()}`, "Sales"]}
                    />
                    <Bar dataKey="sales" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
            )}
          </CardContent>
        </Card>

        {/* Visitor Traffic Line Chart */}
        <Card className="rounded-2xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Visitor Volume</CardTitle>
            <CardDescription className="text-xs text-zinc-500">Unique store sessions per day</CardDescription>
          </CardHeader>
          <CardContent>
            {isMounted ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161, 161, 170, 0.2)" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#888" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(24, 24, 27, 0.9)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                      formatter={(val: number) => [val.toLocaleString(), "Visitors"]}
                    />
                    <Line type="monotone" dataKey="visitors" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
