"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Clock, MapPin, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { JobDetail } from "./job-detail"
import { ChevronDown } from "./chevron-down" // Import ChevronDown component

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

const JOBS: Job[] = [
  {
    id: "job-1",
    status: "completed",
    address: "123 Oak Street, Downtown",
    pickupType: "regular",
    weight: "12 kg",
    timeWindow: "08:15 - 08:45",
    requesterName: "Sarah Johnson",
    distance: "0.3 km",
  },
  {
    id: "job-2",
    status: "in-progress",
    address: "456 Pine Avenue, Midtown",
    pickupType: "regular",
    weight: "18 kg",
    timeWindow: "09:00 - 09:30",
    requesterName: "Mike Chen",
    distance: "1.8 km",
  },
  {
    id: "job-3",
    status: "pending",
    address: "789 Elm Road, North District",
    pickupType: "priority",
    weight: "25 kg",
    timeWindow: "10:00 - 10:15",
    requesterName: "Emma Davis",
    distance: "3.2 km",
  },
  {
    id: "job-4",
    status: "pending",
    address: "321 Maple Lane, Suburbs",
    pickupType: "regular",
    weight: "16 kg",
    timeWindow: "11:00 - 11:45",
    requesterName: "James Wilson",
    distance: "5.1 km",
  },
]

interface JobQueueProps {
  selectedJob: string | null
  onSelectJob: (jobId: string | null) => void
}

export function JobQueue({ selectedJob, onSelectJob }: JobQueueProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [jobs, setJobs] = useState(JOBS)

  const handleAccept = (jobId: string) => {
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "in-progress" as const } : j)))
  }

  const handleReject = (jobId: string) => {
    setJobs(jobs.filter((j) => j.id !== jobId))
  }

  const pendingJobs = jobs.filter((j) => j.status === "pending")
  const activeJobs = jobs.filter((j) => j.status === "in-progress")
  const completedJobs = jobs.filter((j) => j.status === "completed")

  return (
    <div className="flex flex-col h-full gap-2">
      <div>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Job Queue</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {pendingJobs.length} pending • {activeJobs.length} active • {completedJobs.length} completed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {/* Pending Jobs */}
        {pendingJobs.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Awaiting Action
            </div>
            {pendingJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob === job.id}
                isExpanded={expandedJob === job.id}
                onSelect={() => onSelectJob(job.id)}
                onExpand={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                onAccept={() => handleAccept(job.id)}
                onReject={() => handleReject(job.id)}
              />
            ))}
          </div>
        )}

        {/* Active Jobs */}
        {activeJobs.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">In Progress</div>
            {activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob === job.id}
                isExpanded={expandedJob === job.id}
                onSelect={() => onSelectJob(job.id)}
                onExpand={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                onAccept={() => {}}
                onReject={() => {}}
              />
            ))}
          </div>
        )}

        {/* Completed Jobs */}
        {completedJobs.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Completed</div>
            {completedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob === job.id}
                isExpanded={expandedJob === job.id}
                onSelect={() => onSelectJob(job.id)}
                onExpand={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                onAccept={() => {}}
                onReject={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onExpand: () => void
  onAccept: () => void
  onReject: () => void
}

function JobCard({ job, isSelected, isExpanded, onSelect, onExpand, onAccept, onReject }: JobCardProps) {
  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-primary" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  return (
    <>
      <Card
        className={`p-3 cursor-pointer transition-all border ${
          isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-secondary"
        } ${job.status === "completed" ? "opacity-60" : ""}`}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {statusIcon(job.status)}
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  job.pickupType === "priority" ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {job.pickupType === "priority" ? "🚨 Priority" : "Regular"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{job.address}</p>
                <p className="text-xs text-muted-foreground">{job.requesterName}</p>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpand()
            }}
            className="text-muted-foreground hover:text-primary flex-shrink-0"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
            <JobDetail job={job} />
            {job.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAccept()
                  }}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 h-8 text-xs hover:bg-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onReject()
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
            {job.status === "in-progress" && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Complete
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  )
}
