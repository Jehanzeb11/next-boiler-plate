// ---------------------------------------------------------------------------
// 404 — Not Found
// Rendered by Next.js when notFound() is called or no route matches.
// ---------------------------------------------------------------------------
import Link from "next/link"
import { APP_NAME } from "@/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: `404 — Page not found | ${APP_NAME}`,
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-md text-center space-y-4">
        <p className="text-8xl font-black text-zinc-200 dark:text-zinc-800 select-none">
          404
        </p>

        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Page not found
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            The page you were looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
