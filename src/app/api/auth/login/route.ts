// ---------------------------------------------------------------------------
// POST /api/auth/login  — BFF login route
//
// Two modes:
//   • Demo mode  (NEXT_PUBLIC_API_BASE_URL is empty)
//     Checks DEMO_ACCOUNTS, mints a signed identity JWT via mintIdentityToken.
//
//   • Production mode  (NEXT_PUBLIC_API_BASE_URL is set)
//     Forwards credentials to the backend, seals the returned token.
//
// The client never sees the raw token in either mode.
// ---------------------------------------------------------------------------
import { NextResponse, type NextRequest } from "next/server"
import { createSession, mintIdentityToken } from "@/server/session"
import { findDemoAccount } from "@/server/demo-accounts"
import { LoginSchema } from "@/features/auth/validations"
import { IS_DEMO_MODE, API_BASE_URL } from "@/constants"

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 })
  }

  const parsed = LoginSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation failed.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { email, password } = parsed.data

  // ── Demo mode ──────────────────────────────────────────────────────────────
  if (IS_DEMO_MODE) {
    const match = findDemoAccount(email, password)
    if (!match) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 })
    }

    const accessToken = await mintIdentityToken({
      sub: match.user.id,
      email: match.user.email,
      name: match.user.name,
      role: match.user.role,
      demo: true,
    })
    await createSession(accessToken)
    return NextResponse.json({ ok: true })
  }

  // ── Production mode ────────────────────────────────────────────────────────
  try {
    const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!backendRes.ok) {
      const errorBody = (await backendRes.json().catch(() => ({}))) as { message?: string }
      return NextResponse.json(
        { message: errorBody.message ?? "Invalid credentials." },
        { status: backendRes.status }
      )
    }

    const body = (await backendRes.json()) as { accessToken?: string }
    if (!body.accessToken) {
      return NextResponse.json({ message: "Unexpected response from server." }, { status: 502 })
    }

    await createSession(body.accessToken)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[/api/auth/login]", err)
    return NextResponse.json(
      { message: "Unable to reach the authentication server. Please try again." },
      { status: 503 }
    )
  }
}
