"use client"

import { signOut } from "next-auth/react"
import { ArrowLeft, Settings, LogOut, Award, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileScreenProps {
  onNavigate: (screen: string) => void
}

export default function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-1 hover:bg-primary-foreground/20 rounded transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {/* Profile Card */}
        <Card className="bg-linear-to-br from-primary/20 to-accent/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center text-3xl">
                👤
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Sarah Chen</h2>
                <p className="text-sm text-muted-foreground">Member since March 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pickups", value: "24", icon: "📦" },
            { label: "Recycled", value: "156 kg", icon: "♻️" },
            { label: "Points", value: "3.2k", icon: "⭐" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="pt-4 text-center">
                <p className="text-xl mb-2">{stat.icon}</p>
                <p className="font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "🎯", name: "First Pickup" },
              { emoji: "🔥", name: "7-Day Streak" },
              { emoji: "🌍", name: "Eco Champion" },
              { emoji: "🚀", name: "Rising Star" },
            ].map((badge, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="pt-4 text-center">
                  <p className="text-2xl mb-1">{badge.emoji}</p>
                  <p className="text-xs font-medium text-foreground">{badge.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Activity
          </h3>
          <Card className="bg-card border-border">
            <CardContent className="divide-y divide-border pt-0">
              {[
                { date: "Today", action: "Scheduled pickup for Thursday" },
                { date: "Nov 10", action: "Recycled 12 kg of materials" },
                { date: "Nov 8", action: "Reached 1,000 point milestone" },
              ].map((item, i) => (
                <div key={i} className="py-3 px-4">
                  <p className="text-xs text-muted-foreground font-semibold">{item.date}</p>
                  <p className="text-sm text-foreground mt-1">{item.action}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <Button variant="outline" className="w-full border-border text-foreground hover:bg-card bg-transparent">
          <Settings className="w-4 h-4 mr-2" />
          Settings & Preferences
        </Button>

        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
          onClick={() => signOut({ callbackUrl: "/signin" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
