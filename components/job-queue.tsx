"use client"

import { useEffect, useMemo, useState } from "react"
import { CheckCircle2, AlertCircle, Clock, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobDetail } from "./job-detail"
import { ChevronDown } from "./chevron-down" // Import ChevronDown component

export type DriverRequest = {
  id: string
  status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  priority: "REGULAR" | "PRIORITY"
  address: string
  latitude: number
  longitude: number
  estimatedWeight: number
  scheduledDate: string
  citizenName: string | null
}

interface JobQueueProps {
  selectedJob: string | null
  onSelectJob: (jobId: string | null) => void
  requests: DriverRequest[]
  error?: string | null
  onDidMutate?: () => void | Promise<void>
}

function mapStatus(status: DriverRequest["status"]): "pending" | "in-progress" | "completed" {
  switch (status) {
    case "COMPLETED":
      return "completed"
    case "IN_PROGRESS":
      return "in-progress"
    default:
      return "pending"
  }
}

export function JobQueue({ selectedJob, onSelectJob, requests, error, onDidMutate }: JobQueueProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [completionPhotoById, setCompletionPhotoById] = useState<Record<string, File | null>>({})
  const [completionPhotoUrlById, setCompletionPhotoUrlById] = useState<Record<string, string | null>>({})
  const pendingJobs = requests.filter((r) => mapStatus(r.status) === "pending")
  const activeJobs = requests.filter((r) => mapStatus(r.status) === "in-progress")
  const completedJobs = requests.filter((r) => mapStatus(r.status) === "completed")

  const knownIds = useMemo(() => new Set(requests.map((r) => r.id)), [requests])

  useEffect(() => {
    // Cleanup stale photo previews when requests list changes.
    setCompletionPhotoById((prev) => {
      const next: Record<string, File | null> = {}
      for (const [id, file] of Object.entries(prev)) {
        if (knownIds.has(id)) next[id] = file
      }
      return next
    })

    setCompletionPhotoUrlById((prev) => {
      const next: Record<string, string | null> = {}
      for (const [id, url] of Object.entries(prev)) {
        if (knownIds.has(id)) next[id] = url
        else if (url) URL.revokeObjectURL(url)
      }
      return next
    })
  }, [knownIds])

  async function mutate(jobId: string, action: "start" | "complete" | "cancel") {
    try {
      setActionError(null)
      setBusyId(jobId)
      const res = await fetch(`/api/driver/requests/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setActionError(json?.error ?? `Action failed (${res.status})`)
        return
      }

      await onDidMutate?.()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed")
    } finally {
      setBusyId(null)
    }
  }

  async function completeWithPhoto(jobId: string) {
    const file = completionPhotoById[jobId]
    if (!file) {
      setActionError("Completion photo is required")
      return
    }

    try {
      setActionError(null)
      setBusyId(jobId)

      const form = new FormData()
      form.append("action", "complete")
      form.append("image", file)

      const res = await fetch(`/api/driver/requests/${jobId}`, {
        method: "PATCH",
        body: form,
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        setActionError(json?.error ?? `Action failed (${res.status})`)
        return
      }

      // Clear cached photo once completed.
      setCompletionPhotoById((prev) => ({ ...prev, [jobId]: null }))
      setCompletionPhotoUrlById((prev) => {
        const prevUrl = prev[jobId]
        if (prevUrl) URL.revokeObjectURL(prevUrl)
        return { ...prev, [jobId]: null }
      })

      await onDidMutate?.()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Action failed")
    } finally {
      setBusyId(null)
    }
  }

  function setCompletionPhoto(jobId: string, file: File | null) {
    setCompletionPhotoById((prev) => ({ ...prev, [jobId]: file }))
    setCompletionPhotoUrlById((prev) => {
      const prevUrl = prev[jobId]
      if (prevUrl) URL.revokeObjectURL(prevUrl)
      return { ...prev, [jobId]: file ? URL.createObjectURL(file) : null }
    })
  }

  return (
    <div className="flex flex-col h-full gap-2">
      <div>
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">Job Queue</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {pendingJobs.length} pending • {activeJobs.length} active • {completedJobs.length} completed
        </p>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        {actionError && <p className="text-xs text-destructive mt-1">{actionError}</p>}
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
                busy={busyId === job.id}
                onAction={(action) => mutate(job.id, action)}
                completionPhotoUrl={completionPhotoUrlById[job.id] ?? null}
                hasCompletionPhoto={Boolean(completionPhotoById[job.id])}
                onPickCompletionPhoto={(file) => setCompletionPhoto(job.id, file)}
                onComplete={() => completeWithPhoto(job.id)}
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
                busy={busyId === job.id}
                onAction={(action) => mutate(job.id, action)}
                completionPhotoUrl={completionPhotoUrlById[job.id] ?? null}
                hasCompletionPhoto={Boolean(completionPhotoById[job.id])}
                onPickCompletionPhoto={(file) => setCompletionPhoto(job.id, file)}
                onComplete={() => completeWithPhoto(job.id)}
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
                busy={busyId === job.id}
                onAction={(action) => mutate(job.id, action)}
                completionPhotoUrl={completionPhotoUrlById[job.id] ?? null}
                hasCompletionPhoto={Boolean(completionPhotoById[job.id])}
                onPickCompletionPhoto={(file) => setCompletionPhoto(job.id, file)}
                onComplete={() => completeWithPhoto(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface JobCardProps {
  job: DriverRequest
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onExpand: () => void
  busy: boolean
  onAction: (action: "start" | "complete" | "cancel") => void
  completionPhotoUrl: string | null
  hasCompletionPhoto: boolean
  onPickCompletionPhoto: (file: File | null) => void
  onComplete: () => void
}

function JobCard({
  job,
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  busy,
  onAction,
  completionPhotoUrl,
  hasCompletionPhoto,
  onPickCompletionPhoto,
  onComplete,
}: JobCardProps) {
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

  const status = mapStatus(job.status)
  const pickupType = job.priority === "PRIORITY" ? "priority" : "regular"

  return (
    <>
      <Card
        className={`p-3 cursor-pointer transition-all border ${
          isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 bg-secondary"
        } ${status === "completed" ? "opacity-60" : ""}`}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {statusIcon(status)}
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  pickupType === "priority" ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {pickupType === "priority" ? "🚨 Priority" : "Regular"}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{job.address}</p>
                <p className="text-xs text-muted-foreground">{job.citizenName ?? "Citizen"}</p>
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
          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
            <JobDetail job={job} />

            {status !== "completed" && (
              <div className="space-y-2">
                {(job.status === "PENDING" || job.status === "SCHEDULED") && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAction("start")
                      }}
                      disabled={busy}
                    >
                      {busy ? "Working…" : "Start"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        onAction("cancel")
                      }}
                      disabled={busy}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {job.status === "IN_PROGRESS" && (
                  <>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Completion photo (required)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          onPickCompletionPhoto(file)
                        }}
                        className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border file:border-border file:bg-background file:px-3 file:py-2 file:text-xs file:font-medium file:text-foreground"
                        disabled={busy}
                      />

                      {completionPhotoUrl && (
                        <div className="overflow-hidden rounded-lg border border-border bg-background">
                          <img src={completionPhotoUrl} alt="Completion" className="w-full h-auto" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          onComplete()
                        }}
                        disabled={busy || !hasCompletionPhoto}
                      >
                        {busy ? "Working…" : "Complete"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          onPickCompletionPhoto(null)
                        }}
                        disabled={busy || !hasCompletionPhoto}
                      >
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  )
}
