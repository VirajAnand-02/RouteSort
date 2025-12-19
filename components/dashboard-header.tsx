"use client"

import { signOut } from "next-auth/react"
import { MapPin, Menu, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card p-4">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RouteSort</h1>
            <p className="text-sm text-muted-foreground">Driver Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">Driver ID: DRV-2847</p>
            <p className="text-xs text-muted-foreground">Shift: 08:00 - 16:00</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={() => signOut({ callbackUrl: "/signin" })}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-secondary">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
