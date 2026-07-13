"use server"
// ---------------------------------------------------------------------------
// Auth Server Actions — no API routes, no fetch calls
//
// login()   validates credentials server-side, creates the session cookie,
//           and redirects. RHF on the client maps the returned errors onto
//           the correct fields.
//
// logout()  clears the session cookie and redirects to /login.
// ---------------------------------------------------------------------------
import { redirect } from "next/navigation"
import { createSession, deleteSession } from "@/lib/session"
import { LoginSchema } from "@/lib/validations/auth"
import { findDemoAccount } from "@/lib/demo-accounts"

// ─── Result type ─────────────────────────────────────────────────────────────

export type LoginResult =
  | { status: "ok" }
  | {
      status: "error"
      fieldErrors?: Partial<Record<"email" | "password", string>>
      message?: string
    }

// ─── login ───────────────────────────────────────────────────────────────────

export async function login(
  _prev: LoginResult | undefined,
  formData: FormData
): Promise<LoginResult> {
  // 1. Validate shape
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors
    return {
      status: "error",
      fieldErrors: {
        email: flat.email?.[0],
        password: flat.password?.[0],
      },
    }
  }

  const { email, password } = parsed.data

  // 2. Check demo credentials (replace with a real DB/API call later)
  const account = findDemoAccount(email, password)

  if (!account) {
    return { status: "error", message: "Invalid email or password." }
  }

  // 3. Seal a demo token into the httpOnly session cookie
  //    In production: call your backend, get a real accessToken, pass it here.
  const demoToken = Buffer.from(
    JSON.stringify({ userId: account.user.id, email: account.user.email, role: account.user.role })
  ).toString("base64url")

  await createSession(demoToken)

  // redirect() throws internally — redirect happens after return
  redirect("/")
}

// ─── logout ──────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await deleteSession()
  redirect("/login")
}
