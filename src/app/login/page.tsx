import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign In — LI Boomers Panel",
}

// LoginForm uses useSearchParams() internally which requires a Suspense boundary
// in the App Router.  The fallback matches the form's height to prevent CLS.
function LoginFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-1.5">
        <div className="h-4 w-10 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      </div>
      <div className="h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            LI Boomers Panel
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-8">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
