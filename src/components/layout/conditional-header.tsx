import { getSession } from "@/server/session"
import { Header } from "./header"

// Server Component — fetches the session once and passes it to Header.
// This avoids a double call to getSession() since Header needs it too.
// React cache() would deduplicate it anyway, but explicit is better.
export async function ConditionalHeader() {
  const session = await getSession()
  if (!session) return null
  return <Header session={session} />
}
