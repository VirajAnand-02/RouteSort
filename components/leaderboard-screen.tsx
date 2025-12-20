"use client"

import { ArrowLeft, Trophy, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface LeaderboardScreenProps {
  onNavigate: (screen: string) => void
}

export default function LeaderboardScreen({ onNavigate }: LeaderboardScreenProps) {
  const leaderboard = [
    { rank: 1, name: "Alex M.", points: 12450, trend: "↑" },
    { rank: 2, name: "Jordan L.", points: 11890, trend: "↑" },
    { rank: 3, name: "Casey P.", points: 11320, trend: "↓" },
    { rank: 4, name: "Morgan T.", points: 10780, trend: "↑" },
    { rank: 5, name: "Riley K.", points: 10420, trend: "=" },
    { rank: 47, name: "You (Sarah)", points: 8560, trend: "↑" },
    { rank: 48, name: "Jamie H.", points: 8450, trend: "↓" },
    { rank: 49, name: "Taylor G.", points: 8320, trend: "↑" },
  ]

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
        <h1 className="text-xl font-bold">Leaderboard</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {leaderboard.slice(0, 3).map((user, i) => (
            <Card
              key={user.rank}
              className={`border-2 ${
                i === 0
                  ? "border-accent/50 bg-accent/5 col-span-1 row-span-2 h-auto"
                  : i === 1
                    ? "border-secondary/50 bg-secondary/5"
                    : "border-primary/50 bg-primary/5"
              }`}
            >
              <CardContent className={`pt-4 text-center ${i === 0 ? "pb-6" : ""}`}>
                <div className="text-3xl mb-2">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
                <p className="font-bold text-foreground">{user.name}</p>
                <p className="text-lg font-bold text-accent mt-1">{(user.points / 1000).toFixed(1)}k</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Full Rankings
          </h2>

          <Card className="bg-card border-border">
            <CardContent className="divide-y divide-border pt-0">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`py-4 px-4 flex items-center gap-3 ${
                    user.rank === 47 ? "bg-primary/5 border-l-4 border-primary" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">#{user.rank}</span>
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${user.rank === 47 ? "text-primary" : "text-foreground"}`}>
                      {user.name}
                    </p>
                  </div>

                  {/* Trend */}
                  <div className="text-sm text-muted-foreground w-6">
                    {user.trend === "↑" && <span className="text-accent">↑</span>}
                    {user.trend === "↓" && <span className="text-destructive">↓</span>}
                    {user.trend === "=" && <span>—</span>}
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{user.points.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-foreground">
              🎯 <span className="font-semibold">You&apos;re gaining momentum!</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Just 1,860 points to reach the top 40</p>
          </div>
        </div>
      </div>
    </div>
  )
}
