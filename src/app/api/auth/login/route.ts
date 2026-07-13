// ---------------------------------------------------------------------------
// POST /api/auth/login  — BFF login route
//
// Two modes:
//   • Demo mode  (NEXT_PUBLIC_API_BASE_URL is empty)
//     Credentials are checked against DEMO_ACCOUNTS in .env.local.
//     A signed demo token is minted locally and sealed into an httpOnly cookie.
//
//   • Production mode  (NEXT_PUBLIC_API_BASE_URL is set)
//     Credentials are forwarded to the backend.
//     The backend-issued token is sealed into an httpOnly cookie.
//
// The client never sees the raw token in either mode.
// ---------------------------------------------------------------------------
import { NextResponse, type NextRequest } from "next/server"
import { SignJWT } from "jose"
import { createSession } from "@/lib/session"
import { LoginSchema } from "@/lib/validations/auth"
import type { User } from "@/types"

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim()
const IS_DEMO = API_BASE === ""

// ─── Demo helpers ─────────────────────────────────────────────────────────────

interface DemoAccount {
  email: string
  password: string
  role: User["role"]
  name: string
}

function getDemoAccounts(): DemoAccount[] {
  try {
    return JSON.parse(process.env.DEMO_ACCOUNTS ?? "[]") as DemoAccount[]
  } catch {
    return []
  }
}

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET?.trim()
  if (!secret) throw new Error("SESSION_SECRET is not set.")
  return new TextEncoder().encode(secret)
}

/** Mint a short-lived demo access token signed with SESSION_SECRET. */
async function mintDemoToken(account: DemoAccount): Promise<string> {
  return new SignJWT({
    sub: account.email,
    email: account.email,
    name: account.name,
    role: account.role,
    demo: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey())
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // 1. Parse and validate body
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
  if (IS_DEMO) {
    const accounts = getDemoAccounts()
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email && a.password === password
    )

    if (!match) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 })
    }

    const accessToken = await mintDemoToken(match)
    await createSession(accessToken)
    return NextResponse.json({ ok: true })
  }

  // ── Production mode ────────────────────────────────────────────────────────
  try {
    const backendRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!backendRes.ok) {
      const errorBody = await backendRes.json().catch(() => ({})) as { message?: string }
      return NextResponse.json(
        { message: errorBody.message ?? "Invalid credentials." },
        { status: backendRes.status }
      )
    }

    const body = (await backendRes.json()) as { accessToken?: string }

    if (!body.accessToken) {
      return NextResponse.json(
        { message: "Unexpected response from server." },
        { status: 502 }
      )
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
