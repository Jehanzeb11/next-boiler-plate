import { getSession } from "@/lib/session"
import { Header } from "./header"

// Server Component — renders the Header only when a session exists.
// This means the Header never appears on the /login page because the
// proxy bounces unauthenticated users there before any layout renders.
export async function ConditionalHeader() {
  const session = await getSession()
  if (!session) return null
  return <Header />
}
