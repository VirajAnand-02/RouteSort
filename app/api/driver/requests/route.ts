import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PickupStatus, PriorityLevel } from "@prisma/client"

import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

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
  if (session.user.role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const driverId = session.user.id
  const route = await prisma.route.findUnique({
    where: { driverId },
    include: {
      stops: {
        orderBy: { sequenceOrder: "asc" },
        include: {
          pickupRequest: {
            include: { citizen: { select: { name: true, email: true } } },
          },
        },
      },
    },
  })

  let requests:
    | Array<{
        id: string
        status: PickupStatus
        priority: PriorityLevel
        address: string
        latitude: number
        longitude: number
        estimatedWeight: number
        scheduledDate: Date
        citizenName: string | null
      }>
    | null = null

  if (route?.stops?.length) {
    requests = route.stops.map((stop) => ({
      id: stop.pickupRequest.id,
      status: stop.pickupRequest.status,
      priority: stop.pickupRequest.priority,
      address: stop.pickupRequest.address,
      latitude: stop.pickupRequest.latitude,
      longitude: stop.pickupRequest.longitude,
      estimatedWeight: stop.pickupRequest.estimatedWeight,
      scheduledDate: stop.pickupRequest.scheduledDate,
      citizenName: stop.pickupRequest.citizen.name ?? stop.pickupRequest.citizen.email,
    }))
  }

  if (!requests) {
    const today = startOfDay(new Date())
    const activeStatuses: PickupStatus[] = [
      PickupStatus.PENDING,
      PickupStatus.SCHEDULED,
      PickupStatus.IN_PROGRESS,
    ]

    const fallback = await prisma.pickupRequest.findMany({
      where: {
        status: { in: activeStatuses },
        scheduledDate: { gte: today },
      },
      orderBy: [{ priority: "desc" }, { scheduledDate: "asc" }],
      take: 50,
      include: { citizen: { select: { name: true, email: true } } },
    })

    requests = fallback.map((pr) => ({
      id: pr.id,
      status: pr.status,
      priority: pr.priority,
      address: pr.address,
      latitude: pr.latitude,
      longitude: pr.longitude,
      estimatedWeight: pr.estimatedWeight,
      scheduledDate: pr.scheduledDate,
      citizenName: pr.citizen.name ?? pr.citizen.email,
    }))
  }

  const stopsCount = requests.length
  const totalEstimatedWeightKg = requests.reduce((sum, r) => sum + (Number.isFinite(r.estimatedWeight) ? r.estimatedWeight : 0), 0)

  return NextResponse.json({
    route: route
      ? {
          id: route.id,
          status: route.status,
          vehicleCapacityKg: route.vehicleCapacity,
          currentLoadKg: route.currentLoad,
          totalDistanceKm: route.totalDistance,
          estimatedTimeMin: route.estimatedTime,
        }
      : null,
    metrics: {
      stopsCount,
      totalEstimatedWeightKg,
    },
    requests: requests.map((r) => ({
      ...r,
      scheduledDate: r.scheduledDate.toISOString(),
    })),
  })
}
