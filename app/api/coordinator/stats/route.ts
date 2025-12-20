import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"
import { PickupStatus } from "@prisma/client"

function percentChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}

function round1(value: number) {
  return Math.round(value * 10) / 10
}

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "COORDINATOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - 7)

  const prevWeekStart = new Date(now)
  prevWeekStart.setDate(prevWeekStart.getDate() - 14)
  const prevWeekEnd = new Date(now)
  prevWeekEnd.setDate(prevWeekEnd.getDate() - 7)

  // Active requests (operational backlog)
  const activeStatuses: PickupStatus[] = [
    PickupStatus.PENDING,
    PickupStatus.SCHEDULED,
    PickupStatus.IN_PROGRESS,
  ]
  const activeRequests = await prisma.pickupRequest.count({
    where: { status: { in: activeStatuses } },
  })

  // Requests created (week vs previous week) for change indicator
  const [newRequestsThisWeek, newRequestsPrevWeek] = await Promise.all([
    prisma.pickupRequest.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pickupRequest.count({ where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
  ])
  const activeRequestsChangePct = round1(percentChange(newRequestsThisWeek, newRequestsPrevWeek))

  // Segregation rate: % of scans marked recyclable
  const [scanThisWeekTotal, scanThisWeekRecyclable, scanPrevWeekTotal, scanPrevWeekRecyclable] =
    await Promise.all([
      prisma.wasteScan.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.wasteScan.count({ where: { createdAt: { gte: weekStart }, isRecyclable: true } }),
      prisma.wasteScan.count({ where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
      prisma.wasteScan.count({ where: { createdAt: { gte: prevWeekStart, lt: prevWeekEnd }, isRecyclable: true } }),
    ])

  const segregationRate = scanThisWeekTotal === 0 ? 0 : (scanThisWeekRecyclable / scanThisWeekTotal) * 100
  const segregationRatePrev =
    scanPrevWeekTotal === 0 ? 0 : (scanPrevWeekRecyclable / scanPrevWeekTotal) * 100
  const segregationRateDeltaPts = round1(segregationRate - segregationRatePrev)

  // Route efficiency: completed pickups / scheduled pickups (week)
  const [scheduledThisWeek, completedThisWeek, scheduledPrevWeek, completedPrevWeek] = await Promise.all([
    prisma.pickupRequest.count({ where: { scheduledDate: { gte: weekStart } } }),
    prisma.pickupRequest.count({ where: { completedAt: { gte: weekStart } } }),
    prisma.pickupRequest.count({ where: { scheduledDate: { gte: prevWeekStart, lt: prevWeekEnd } } }),
    prisma.pickupRequest.count({ where: { completedAt: { gte: prevWeekStart, lt: prevWeekEnd } } }),
  ])

  const routeEfficiency = scheduledThisWeek === 0 ? 0 : (completedThisWeek / scheduledThisWeek) * 100
  const routeEfficiencyPrev =
    scheduledPrevWeek === 0 ? 0 : (completedPrevWeek / scheduledPrevWeek) * 100
  const routeEfficiencyDeltaPts = round1(routeEfficiency - routeEfficiencyPrev)

  // Emissions saved: all-time KPI value (if present)
  const globalKpi = await prisma.globalKPI.findUnique({ where: { id: 1 } })
  const totalCarbonReduced = globalKpi?.totalCarbonReduced ?? 0

  // Waste composition (last 7 days): by MaterialType category counts
  const compositionRaw = await prisma.wasteScan.groupBy({
    by: ["category"],
    where: { createdAt: { gte: weekStart } },
    _count: { _all: true },
  })

  const wasteComposition = compositionRaw
    .map((row) => ({ name: row.category, value: row._count._all }))
    .sort((a, b) => b.value - a.value)

  // Request timeline (today): bucketed counts by current status
  const dayStart = startOfDay(now)
  const buckets = [6, 9, 12, 15, 18]
  const bucketLabels: Record<number, string> = {
    6: "6am",
    9: "9am",
    12: "12pm",
    15: "3pm",
    18: "6pm",
  }
  const routeTimeline = await Promise.all(
    buckets.map(async (hour, idx) => {
      const start = new Date(dayStart)
      start.setHours(hour, 0, 0, 0)
      const end = new Date(dayStart)
      const nextHour = idx + 1 < buckets.length ? buckets[idx + 1] : 24
      end.setHours(nextHour, 0, 0, 0)

      const [pending, assigned, completed] = await Promise.all([
        prisma.pickupRequest.count({
          where: { createdAt: { gte: start, lt: end }, status: PickupStatus.PENDING },
        }),
        prisma.pickupRequest.count({
          where: {
            createdAt: { gte: start, lt: end },
            status: { in: [PickupStatus.SCHEDULED, PickupStatus.IN_PROGRESS] },
          },
        }),
        prisma.pickupRequest.count({
          where: { createdAt: { gte: start, lt: end }, status: PickupStatus.COMPLETED },
        }),
      ])

      return { time: bucketLabels[hour] ?? `${hour}`, pending, assigned, completed }
    }),
  )

  return NextResponse.json({
    kpis: {
      activeRequests,
      activeRequestsChangePct,
      segregationRate: round1(segregationRate),
      segregationRateDeltaPts,
      routeEfficiency: round1(routeEfficiency),
      routeEfficiencyDeltaPts,
      totalCarbonReduced: round1(totalCarbonReduced),
    },
    wasteComposition,
    routeTimeline,
  })
}
