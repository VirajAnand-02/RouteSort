"use client"

import { CalendarClock, Weight } from "lucide-react"

type DriverRequest = {
  scheduledDate: string
  estimatedWeight: number
}

export function JobDetail({ job }: { job: DriverRequest }) {
  const scheduled = new Date(job.scheduledDate)
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-1">
        <CalendarClock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">
          Scheduled: {Number.isNaN(scheduled.getTime()) ? "—" : scheduled.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Weight className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-muted-foreground">Estimated weight: {Math.round(job.estimatedWeight)} kg</span>
      </div>
    </div>
  )
}
