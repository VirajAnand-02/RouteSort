"use client"

import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export function CapacityMonitor() {
  const capacity = 68
  const weight = 68
  const items = 12

  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Vehicle Capacity</h3>
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="space-y-3">
        {/* Weight Capacity */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Weight</span>
            <span className="text-sm font-semibold text-foreground">{weight}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
              style={{ width: `${capacity}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">68 kg / 100 kg</p>
        </div>

        {/* Item Count */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Items</span>
            <span className="text-sm font-semibold text-foreground">{items}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
              style={{ width: `${(items / 25) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">12 / 25 items</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 p-2 bg-secondary rounded-lg border border-border/50">
        <p className="text-xs font-semibold text-primary">✓ Within capacity limits</p>
        <p className="text-xs text-muted-foreground mt-1">Safe to accept 3-4 more items</p>
      </div>
    </Card>
  )
}
