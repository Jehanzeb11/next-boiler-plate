"use client"
// ---------------------------------------------------------------------------
// LoginForm
//
// Flow: RHF validates client-side → onValid builds FormData → Server Action
// The Server Action runs on the server, checks credentials, sets the httpOnly
// cookie, and redirects. Server errors are mapped back onto RHF fields.
// ---------------------------------------------------------------------------
import { useActionState, useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"
import { useState } from "react"

import { login, type LoginResult } from "@/features/auth/actions"
import { LoginSchema, type LoginInput } from "@/features/auth/validations"
import { cn } from "@/utils/cn"

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

// ─── Shared input styles ──────────────────────────────────────────────────────

const inputBase = cn(
  "w-full rounded-lg border bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm",
  "text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
  "focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100",
  "disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
)

// ─── Component ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const [result, dispatch] = useActionState<LoginResult | undefined, FormData>(
    login,
    undefined
  )

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!result || result.status !== "error") return
    if (result.fieldErrors?.email)
      setError("email", { type: "server", message: result.fieldErrors.email })
    if (result.fieldErrors?.password)
      setError("password", { type: "server", message: result.fieldErrors.password })
    if (result.message && !result.fieldErrors?.email && !result.fieldErrors?.password)
      setError("root.serverError", { type: "server", message: result.message })
  }, [result, setError])

  function onValid(data: LoginInput) {
    const fd = new FormData()
    fd.set("email", data.email)
    fd.set("password", data.password)
    fd.set("callbackUrl", callbackUrl)
    startTransition(() => dispatch(fd))
  }

  const busy = isPending

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5" noValidate>
      {/* Top-level error */}
      {errors.root?.serverError?.message && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          <svg className="mt-0.5 size-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1ZM7.25 4.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5Zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
          </svg>
          {errors.root.serverError.message}
        </div>
      )}

      {/* Email */}
      <Field label="Email" id="email" error={errors.email?.message}>
        <input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="admin@example.com"
          disabled={busy}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          className={cn(
            inputBase,
            errors.email
              ? "border-red-400 dark:border-red-600 focus:ring-red-500"
              : "border-zinc-300 dark:border-zinc-600"
          )}
        />
      </Field>

      {/* Password */}
      <Field label="Password" id="password" error={errors.password?.message}>
        <div className="relative">
          <input
            {...register("password")}
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={busy}
            aria-describedby={errors.password ? "password-error" : undefined}
            aria-invalid={!!errors.password}
            className={cn(
              inputBase,
              "pr-10",
              errors.password
                ? "border-red-400 dark:border-red-600 focus:ring-red-500"
                : "border-zinc-300 dark:border-zinc-600"
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            {showPassword ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />}
          </button>
        </div>
      </Field>

      {/* Submit */}
      <button
        type="submit"
        disabled={busy}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-lg",
          "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
          "px-4 py-2.5 text-sm font-semibold",
          "hover:bg-zinc-700 dark:hover:bg-zinc-100",
          "focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:ring-offset-2",
          "disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        )}
      >
        {busy ? (
          <><Loader2 size={16} className="animate-spin" aria-hidden />Signing in…</>
        ) : (
          <><LogIn size={16} aria-hidden />Sign in</>
        )}
      </button>

    </form>
  )
}
