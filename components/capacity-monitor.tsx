"use client"

import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

export function CapacityMonitor({
  vehicleCapacityKg,
  currentLoadKg,
  stopsCount,
  totalEstimatedWeightKg,
}: {
  vehicleCapacityKg?: number
  currentLoadKg?: number
  stopsCount?: number
  totalEstimatedWeightKg?: number
}) {
  const capacity = vehicleCapacityKg ?? 0
  const currentLoad = currentLoadKg ?? totalEstimatedWeightKg ?? 0
  const items = stopsCount ?? 0
  const pct = capacity > 0 ? Math.min(100, Math.max(0, (currentLoad / capacity) * 100)) : 0
  const within = capacity > 0 ? currentLoad <= capacity : true

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
            <span className="text-sm font-semibold text-foreground">{Math.round(pct)}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(currentLoad)} kg / {capacity > 0 ? Math.round(capacity) : "—"} kg
          </p>
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
              style={{ width: `${Math.min(100, (items / 25) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{items} / 25 items</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-4 p-2 bg-secondary rounded-lg border border-border/50">
        <p className={`text-xs font-semibold ${within ? "text-primary" : "text-destructive"}`}>
          {within ? "✓ Within capacity limits" : "⚠ Over capacity"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {capacity > 0 ? `Remaining: ${Math.max(0, Math.round(capacity - currentLoad))} kg` : "Capacity not set"}
        </p>
      </div>
    </Card>
  )
}
