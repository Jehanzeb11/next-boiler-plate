"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, CalendarIcon, Check, ImageIcon, Sparkles, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Attachment,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentDescription,
} from "@/components/ui/attachment"

// ─── Zod Form Schema ─────────────────────────────────────────────────────────

const addProductSchema = z.object({
  title: z
    .string()
    .min(3, "Product title must be at least 3 characters")
    .max(100, "Title is too long"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number" })
    .min(0.01, "Price must be greater than $0.00"),
  category: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description is too long"),
})

type AddProductInput = z.infer<typeof addProductSchema>

interface AddProductDialogProps {
  children?: React.ReactNode
}

export function AddProductDialog({ children }: AddProductDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [releaseDate, setReleaseDate] = React.useState<Date | undefined>(new Date())
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductInput>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: "",
      price: undefined,
      category: "electronics",
      description: "",
    },
  })

  const onSubmit = (data: AddProductInput) => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setOpen(false)
      toast.success(`Product "${data.title}" added to inventory!`, {
        description: `Price: $${data.price.toFixed(2)} | Category: ${data.category} | Scheduled: ${releaseDate ? format(releaseDate, "PP") : "Immediate"}`,
      })
      reset()
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          children ? (
            (children as React.ReactElement)
          ) : (
            <Button size="sm" className="gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-purple-500/25 transition-all">
              <Plus className="h-3.5 w-3.5" /> Add Product
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg rounded-3xl border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white">
              Create Catalog Item
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
            Validated catalog entry with automated release schedule and attachment preview.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2" noValidate>
          {/* Title Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Product Title *
            </label>
            <Input
              {...register("title")}
              placeholder="e.g. Ergonomic Mechanical Keyboard"
              className={`h-9 text-xs rounded-xl transition-all ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
              }`}
            />
            {errors.title && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="h-3 w-3" /> {errors.title.message}
              </p>
            )}
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Price ($) *
              </label>
              <Input
                {...register("price")}
                type="number"
                step="0.01"
                placeholder="129.99"
                className={`h-9 text-xs rounded-xl transition-all ${
                  errors.price
                    ? "border-red-500 focus:ring-red-500"
                    : "border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
                }`}
              />
              {errors.price && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="h-3 w-3" /> {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full h-9 px-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
              </select>
            </div>
          </div>

          {/* Release Date Datepicker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Release Date (Datepicker)
            </label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left text-xs h-9 rounded-xl font-normal border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-purple-600" />
                    {releaseDate ? format(releaseDate, "PPP") : <span>Pick release date</span>}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0 rounded-2xl border-zinc-200 dark:border-zinc-800" align="start">
                <Calendar
                  mode="single"
                  selected={releaseDate}
                  onSelect={(d) => {
                    setReleaseDate(d)
                    setPopoverOpen(false)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description *
            </label>
            <Input
              {...register("description")}
              placeholder="High quality product details and features..."
              className={`h-9 text-xs rounded-xl transition-all ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-zinc-200 dark:border-zinc-800 focus:border-purple-500"
              }`}
            />
            {errors.description && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="h-3 w-3" /> {errors.description.message}
              </p>
            )}
          </div>

          {/* Attachment Component */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Product Asset Attachment
            </label>
            <Attachment className="w-full justify-between rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 p-2">
              <AttachmentMedia variant="icon" className="bg-purple-100 dark:bg-purple-950/60 text-purple-600">
                <ImageIcon className="h-4 w-4" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle className="text-xs font-medium">keyboard-hero-shot.png</AttachmentTitle>
                <AttachmentDescription className="text-[10px] text-zinc-400">1.8 MB • Attached</AttachmentDescription>
              </AttachmentContent>
              <Button type="button" variant="ghost" size="xs" className="text-xs text-purple-600 hover:text-purple-700">
                Change
              </Button>
            </Attachment>
          </div>

          <Separator className="my-2 bg-zinc-200/80 dark:bg-zinc-800/80" />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold gap-2 shadow-md shadow-purple-500/20"
            >
              {loading ? <Spinner className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
              {loading ? "Saving..." : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
