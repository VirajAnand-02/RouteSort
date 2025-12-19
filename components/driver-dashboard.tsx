"use client"

import { useState } from "react"
import { MapContainer } from "./map-container"
import { JobQueue } from "./job-queue"
import { DashboardHeader } from "./dashboard-header"
import { CapacityMonitor } from "./capacity-monitor"
import { RouteOptimizer } from "./route-optimizer"

export function DriverDashboard() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")

  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Map & Route Visualization */}
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
          <MapContainer selectedJob={selectedJob} />
          <RouteOptimizer />
        </div>

        {/* Right Panel - Job Queue & Monitoring */}
        <div className="w-96 flex flex-col gap-4 p-4 bg-card border-l border-border overflow-hidden">
          <JobQueue selectedJob={selectedJob} onSelectJob={setSelectedJob} />
          <CapacityMonitor />
        </div>
      </div>
    </div>
  )
}
