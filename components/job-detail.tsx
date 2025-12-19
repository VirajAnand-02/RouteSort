"use client"

import { Clock, Users } from "lucide-react"

interface Job {
  id: string
  status: "pending" | "in-progress" | "completed"
  address: string
  pickupType: "regular" | "priority"
  weight: string
  timeWindow: string
  requesterName: string
  distance: string
}

export function JobDetail({ job }: { job: Job }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">{job.timeWindow}</span>
      </div>
      <div className="flex items-center gap-1">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Distance: {job.distance}</span>
      </div>
    </div>
  )
}
