import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth-options"

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/signin?callbackUrl=/coordinator")
  }

  if (session.user.role !== "COORDINATOR") {
    redirect("/signin?error=AccessDenied&callbackUrl=/coordinator")
  }

  return children
}
