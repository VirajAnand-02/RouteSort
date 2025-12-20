"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { MapContainer } from "./map-container"
import { JobQueue } from "./job-queue"
import { DashboardHeader } from "./dashboard-header"
import { CapacityMonitor } from "./capacity-monitor"
import { RouteOptimizer } from "./route-optimizer"

type DriverRequest = {
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

type DriverRequestsResponse = {
  route: null | {
    id: string
    status: string
    vehicleCapacityKg: number
    currentLoadKg: number
    totalDistanceKm: number | null
    estimatedTimeMin: number | null
  }
  metrics: {
    stopsCount: number
    totalEstimatedWeightKg: number
  }
  requests: DriverRequest[]
}

type DriverLocation = {
  lat: number
  lng: number
  accuracy?: number
}

export function DriverDashboard() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<DriverLocation | null>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [data, setData] = useState<DriverRequestsResponse | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setDataError(null)
      const res = await fetch("/api/driver/requests", { cache: "no-store" })
      if (!res.ok) throw new Error(`Failed to load requests (${res.status})`)
      const json = (await res.json()) as DriverRequestsResponse
      setData(json)
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Failed to load requests")
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    refresh()
    const interval = setInterval(() => {
      if (cancelled) return
      refresh()
    }, 20_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [refresh])

  const currentLocationLabel = gpsError
    ? gpsError
    : currentLocation
      ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
      : "Waiting for GPS…"

  const requests = useMemo(() => data?.requests ?? [], [data?.requests])

  return (
    <div className="flex h-screen flex-col bg-background">
      <DashboardHeader currentLocationLabel={currentLocationLabel} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Map & Route Visualization */}
        <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">
            <MapContainer
              selectedJob={selectedJob}
              requests={requests.map((r) => ({
                id: r.id,
                status: r.status,
                address: r.address,
                latitude: r.latitude,
                longitude: r.longitude,
              }))}
              routeMeta={{
                totalDistanceKm: data?.route?.totalDistanceKm ?? null,
                estimatedTimeMin: data?.route?.estimatedTimeMin ?? null,
              }}
              onLocationChange={(loc) => {
                setGpsError(null)
                setCurrentLocation(loc)
              }}
              onLocationError={(message) => {
                setGpsError(message)
              }}
            />
          <RouteOptimizer routeMeta={data?.route ?? undefined} requests={requests} />
        </div>

        {/* Right Panel - Job Queue & Monitoring */}
        <div className="w-96 flex flex-col gap-4 p-4 bg-card border-l border-border overflow-hidden">
          <JobQueue
            selectedJob={selectedJob}
            onSelectJob={setSelectedJob}
            requests={requests}
            error={dataError}
            onDidMutate={refresh}
          />
          <CapacityMonitor
            vehicleCapacityKg={data?.route?.vehicleCapacityKg}
            currentLoadKg={data?.route?.currentLoadKg}
            stopsCount={data?.metrics?.stopsCount}
            totalEstimatedWeightKg={data?.metrics?.totalEstimatedWeightKg}
          />
        </div>
      </div>
    </div>
  )
}
