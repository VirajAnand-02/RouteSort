"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Calendar, Zap, Trophy, QrCode, User, History } from "lucide-react"

interface DashboardProps {
  onNavigate: (screen: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [upcomingPickup, setUpcomingPickup] = useState("Tomorrow, 2:00 PM")

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 sticky top-0 z-10">
        <div className="flex justify-between items-start max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-primary-foreground/80 text-sm">Sarah</p>
          </div>
          <button
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center hover:bg-primary-foreground/30 transition"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">Points Today</span>
                </div>
                <p className="text-2xl font-bold text-foreground">425</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Your Rank</span>
                </div>
                <p className="text-2xl font-bold text-foreground">#47</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Pickup Card */}
        <Card className="bg-gradient-to-br from-primary/20 to-secondary/10 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Next Pickup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-card rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">{upcomingPickup}</p>
              <p className="text-xs text-muted-foreground mt-1">📍 123 Green Street</p>
            </div>
            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent">
              Reschedule
            </Button>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => onNavigate("scanner")}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary transition flex items-center gap-3 text-left"
          >
            <div className="p-3 bg-accent/20 rounded-lg">
              <QrCode className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Scan Material</h3>
              <p className="text-xs text-muted-foreground">Get recycling guidance</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("rewards")}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary transition flex items-center gap-3 text-left"
          >
            <div className="p-3 bg-primary/20 rounded-lg">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">My Rewards</h3>
              <p className="text-xs text-muted-foreground">3,250 points available</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("leaderboard")}
            className="bg-card border border-border rounded-lg p-4 hover:border-primary transition flex items-center gap-3 text-left"
          >
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Leaderboard</h3>
              <p className="text-xs text-muted-foreground">See community rankings</p>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
          </div>
          <Card className="bg-card border-border">
            <CardContent className="divide-y divide-border pt-4">
              {[
                { material: "Plastic #1 Bottles", points: "+150", date: "Today" },
                { material: "Aluminum Cans", points: "+100", date: "Yesterday" },
                { material: "Glass Jars", points: "+75", date: "2 days ago" },
              ].map((item, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.material}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-accent">{item.points}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto flex justify-around items-center py-3">
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-primary"
          >
            <Leaf className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => onNavigate("scanner")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary"
          >
            <QrCode className="w-5 h-5" />
            <span className="text-xs">Scan</span>
          </button>
          <button
            onClick={() => onNavigate("rewards")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary"
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs">Rewards</span>
          </button>
          <button
            onClick={() => onNavigate("leaderboard")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Ranks</span>
          </button>
        </div>
      </div>
    </div>
  )
}
