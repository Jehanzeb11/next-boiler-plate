// ---------------------------------------------------------------------------
// GET /api/auth/token
//
// Returns the access token from the sealed session cookie to same-origin
// client-side code (used by apiClient to attach Authorization headers).
// Never expose this to cross-origin requests.
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server"
import { getSession } from "@/server/session"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 })
  }
  return NextResponse.json({ accessToken: session.accessToken })
}
