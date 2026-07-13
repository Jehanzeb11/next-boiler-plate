// Server Component — no "use client" needed, no JS shipped for this UI
import Image from "next/image"
import type { Product } from "@/actions/products"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image container — fixed height prevents CLS */}
      <div className="relative h-52 w-full bg-zinc-50 dark:bg-zinc-800 p-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4"
        />
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Category badge */}
        <span className="self-start text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
          {product.category}
        </span>

        {/* Title */}
        <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-snug">
          {product.title}
        </h2>

        {/* Description */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer: price + rating */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            ${product.price.toFixed(2)}
          </span>

          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
            {/* Star icon (inline SVG — zero extra dependencies) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-amber-400"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {product.rating.rate}
              </span>
              <span className="ml-1">({product.rating.count})</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
