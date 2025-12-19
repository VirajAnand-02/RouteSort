import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth-options"

export default async function CitizenAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/signin?callbackUrl=/app")
  }

  if (session.user.role !== "CITIZEN") {
    redirect("/signin?error=AccessDenied&callbackUrl=/app")
  }

  return children
}
