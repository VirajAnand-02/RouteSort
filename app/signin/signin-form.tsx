"use client"

import { useMemo, useState } from "react"
import { signIn } from "next-auth/react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignInForm({
  callbackUrl,
  error,
}: {
  callbackUrl: string
  error?: string
}) {
  const errorMessage = useMemo(() => {
    if (!error) return null
    if (error === "AccessDenied") return "You don’t have access to that area."
    return "Sign in failed. Check your credentials."
  }, [error])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            {errorMessage ? (
              <div className="text-sm text-destructive">{errorMessage}</div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>

            <div className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a className="underline" href="/signup">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
