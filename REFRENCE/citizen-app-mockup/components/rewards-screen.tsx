"use client"

import { ArrowLeft, Gift, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface RewardsScreenProps {
  onNavigate: (screen: string) => void
}

export default function RewardsScreen({ onNavigate }: RewardsScreenProps) {
  const points = 3250
  const rewards = [
    { id: 1, name: "Free Pickup", cost: 500, description: "Skip this month's fee", icon: "🚚" },
    { id: 2, name: "Coffee Card", cost: 750, description: "Local café $10 credit", icon: "☕" },
    { id: 3, name: "Plant Kit", cost: 1200, description: "Home garden starter pack", icon: "🌱" },
    { id: 4, name: "Donation: Ocean", cost: 800, description: "Clean ocean initiative", icon: "🌊" },
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
        <h1 className="text-xl font-bold">My Rewards</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {/* Points Balance */}
        <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-5xl font-bold text-primary">{points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Keep recycling to earn more!</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent" />
            Redeem Rewards
          </h2>

          <div className="space-y-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="bg-card border-border hover:border-primary transition">
                <CardContent className="pt-4">
                  <div className="flex gap-4">
                    <div className="text-2xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{reward.name}</h3>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <p className="font-bold text-primary">{reward.cost}</p>
                      <Button
                        size="sm"
                        disabled={points < reward.cost}
                        className={`text-xs h-7 ${
                          points >= reward.cost
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        Claim
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Aggregation Centers */}
        <div>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Nearby Centers
          </h2>

          <div className="space-y-2">
            {[
              { name: "Green Hub Downtown", distance: "0.8 km away", hours: "Open now" },
              { name: "Eco Station Mall", distance: "2.3 km away", hours: "Opens 9am" },
            ].map((center, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="pt-3 pb-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{center.name}</p>
                      <p className="text-xs text-muted-foreground">{center.distance}</p>
                    </div>
                    <p className="text-xs font-semibold text-accent">{center.hours}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
