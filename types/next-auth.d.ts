import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string
      role?: "CITIZEN" | "DRIVER" | "COORDINATOR"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "CITIZEN" | "DRIVER" | "COORDINATOR"
  }
}
