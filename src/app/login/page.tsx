import type { Metadata } from "next"
import { Suspense } from "react"
import { BarChart3, Package, Shield, Sparkles, Users } from "lucide-react"
import { LoginForm } from "@/features/auth/components/login-form"
import { APP_NAME } from "@/constants"

export const metadata: Metadata = {
  title: `Sign In — ${APP_NAME}`,
  description: "Sign in to your admin dashboard.",
}

const features = [
  { icon: BarChart3, label: "Real-time analytics & charts" },
  { icon: Package,   label: "Inventory & catalog management" },
  { icon: Users,     label: "Team access & role controls" },
  { icon: Shield,    label: "JWT-secured session auth" },
]

function LoginFormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-1.5">
        <div className="h-4 w-10 rounded bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-10 rounded-lg bg-muted" />
      </div>
      <div className="h-10 rounded-lg bg-muted" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* ── Left panel: branding ──────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-indigo-950 via-purple-950 to-zinc-950 flex-col items-start justify-between p-12 text-white">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-400 via-purple-400 to-pink-400 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-none">{APP_NAME}</p>
            <p className="text-[10px] font-semibold text-purple-300 tracking-widest uppercase mt-0.5">
              Enterprise Panel
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Full-stack admin<br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-300 via-pink-300 to-indigo-300">
                boilerplate
              </span>{" "}
              ready to ship.
            </h1>
            <p className="text-sm text-purple-100/70 leading-relaxed max-w-sm">
              A production-ready Next.js 16 dashboard starter with auth, data fetching, charts, and team management — all wired up and ready for your next project.
            </p>
          </div>

          <ul className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-purple-100/80">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/10">
                  <Icon className="h-3.5 w-3.5 text-purple-300" />
                </div>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer quote */}
        <p className="relative z-10 text-[11px] text-purple-300/50">
          Built with Next.js 16 · Tailwind v4 · shadcn/ui · TanStack Query
        </p>
      </div>

      {/* ── Right panel: login form ───────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-foreground">{APP_NAME}</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to access your admin dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm shadow-black/5 p-8">
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo credentials:{" "}
            <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              admin@example.com
            </code>{" "}
            /{" "}
            <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              password
            </code>
          </p>
        </div>
      </div>
    </main>
  )
}
