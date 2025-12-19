"use client"

import { Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function RouteOptimizer() {
  return (
    <Card className="p-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Smart Route</h3>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded">Optimized</span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-foreground">8.4 km</p>
            <p className="text-xs text-muted-foreground">Total distance</p>
          </div>
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-foreground">24 min</p>
            <p className="text-xs text-muted-foreground">Est. time</p>
          </div>
          <div className="bg-secondary rounded p-2 text-center">
            <p className="text-lg font-bold text-primary">-18%</p>
            <p className="text-xs text-muted-foreground">vs original</p>
          </div>
        </div>

        <div className="bg-secondary rounded p-3 border border-border/50">
          <p className="text-xs font-semibold text-foreground mb-2">Suggested order:</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">1. Downtown (0.3 km)</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">2. Midtown (1.8 km)</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">3. North District (3.2 km)</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">4. Suburbs (5.1 km)</span>
            </div>
          </div>
        </div>

        <Button className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          Apply Optimized Route
        </Button>
      </div>
    </Card>
  )
}
