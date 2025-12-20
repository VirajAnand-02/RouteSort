"use client"

import { Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

type DriverRequest = { id: string }
type RouteMeta = {
  status: string
  totalDistanceKm: number | null
  estimatedTimeMin: number | null
}

export function RouteOptimizer({
  routeMeta,
  requests,
}: {
  routeMeta?: RouteMeta
  requests: DriverRequest[]
}) {
  const distanceLabel = routeMeta?.totalDistanceKm != null ? `${routeMeta.totalDistanceKm.toFixed(1)} km` : "—"
  const timeLabel = routeMeta?.estimatedTimeMin != null ? `${routeMeta.estimatedTimeMin} min` : "—"
  const statusLabel = routeMeta?.status ?? (requests.length ? "ACTIVE" : "NO ROUTE")

  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Smart Route</h3>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded">{statusLabel}</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-foreground">{distanceLabel}</p>
            <p className="text-xs text-muted-foreground">Total distance</p>
          </div>
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-foreground">{timeLabel}</p>
            <p className="text-xs text-muted-foreground">Est. time</p>
          </div>
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-primary">{requests.length}</p>
            <p className="text-xs text-muted-foreground">Stops</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
