import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { PickupStatus } from "@prisma/client"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

type Action = "start" | "complete" | "cancel"

async function saveUpload(file: File) {
  const maxBytes = 6 * 1024 * 1024
  if (file.size > maxBytes) {
    throw new Error("Image too large (max 6MB)")
  }

  const mimeType = file.type || "image/jpeg"
  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = mimeType === "image/png" ? "png" : "jpg"
  const fileName = `${crypto.randomUUID()}.${ext}`

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await fs.mkdir(uploadDir, { recursive: true })
  const uploadAbs = path.join(uploadDir, fileName)
  await fs.writeFile(uploadAbs, bytes)

  return `/uploads/${fileName}`
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await ctx.params
  if (!id) {
    return NextResponse.json({ error: "Missing request id" }, { status: 400 })
  }

  const contentType = req.headers.get("content-type") ?? ""
  let action: Action | null = null
  let completionPhoto: File | null = null
  let completionNotes: string | null = null

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData()
    const raw = form.get("action")
    action = typeof raw === "string" ? (raw as Action) : null
    const img = form.get("image")
    completionPhoto = img instanceof File ? img : null
    const notes = form.get("notes")
    completionNotes = typeof notes === "string" ? notes : null
  } else {
    const body = (await req.json().catch(() => null)) as null | { action?: Action }
    action = body?.action ?? null
  }

  if (!action || !["start", "complete", "cancel"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const existing = await prisma.pickupRequest.findUnique({
    where: { id },
    include: {
      routeStop: {
        include: {
          route: { select: { driverId: true } },
        },
      },
    },
  })

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // If this request is assigned to a route, only that driver may mutate it.
  if (existing.routeStop?.route?.driverId && existing.routeStop.route.driverId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const now = new Date()

  if (action === "start") {
    if (!(existing.status === PickupStatus.PENDING || existing.status === PickupStatus.SCHEDULED)) {
      return NextResponse.json({ error: "Cannot start from current status" }, { status: 409 })
    }

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.IN_PROGRESS,
        routeStop:
          existing.routeStop
            ? {
                update: {
                  arrivalAt: existing.routeStop.arrivalAt ?? now,
                },
              }
            : undefined,
      },
      include: { citizen: { select: { name: true, email: true } } },
    })

    return NextResponse.json({
      request: {
        id: updated.id,
        status: updated.status,
        priority: updated.priority,
        address: updated.address,
        latitude: updated.latitude,
        longitude: updated.longitude,
        estimatedWeight: updated.estimatedWeight,
        scheduledDate: updated.scheduledDate.toISOString(),
        citizenName: updated.citizen.name ?? updated.citizen.email,
      },
    })
  }

  if (action === "complete") {
    if (!(existing.status === PickupStatus.IN_PROGRESS || existing.status === PickupStatus.SCHEDULED)) {
      return NextResponse.json({ error: "Cannot complete from current status" }, { status: 409 })
    }

    if (!completionPhoto) {
      return NextResponse.json({ error: "Completion photo is required" }, { status: 400 })
    }

    let pickupPhotoUrl: string
    try {
      pickupPhotoUrl = await saveUpload(completionPhoto)
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to save photo" }, { status: 400 })
    }

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: {
        status: PickupStatus.COMPLETED,
        completedAt: now,
        pickupPhotoUrl,
        completionNotes: completionNotes ?? undefined,
        routeStop:
          existing.routeStop
            ? {
                update: {
                  isCompleted: true,
                  departureAt: now,
                  arrivalAt: existing.routeStop.arrivalAt ?? now,
                },
              }
            : undefined,
      },
      include: { citizen: { select: { name: true, email: true } } },
    })

    return NextResponse.json({
      request: {
        id: updated.id,
        status: updated.status,
        priority: updated.priority,
        address: updated.address,
        latitude: updated.latitude,
        longitude: updated.longitude,
        estimatedWeight: updated.estimatedWeight,
        scheduledDate: updated.scheduledDate.toISOString(),
        citizenName: updated.citizen.name ?? updated.citizen.email,
      },
    })
  }

  // cancel
  if (!(existing.status === PickupStatus.PENDING || existing.status === PickupStatus.SCHEDULED)) {
    return NextResponse.json({ error: "Cannot cancel from current status" }, { status: 409 })
  }

  const updated = await prisma.pickupRequest.update({
    where: { id },
    data: {
      status: PickupStatus.CANCELLED,
    },
    include: { citizen: { select: { name: true, email: true } } },
  })

  return NextResponse.json({
    request: {
      id: updated.id,
      status: updated.status,
      priority: updated.priority,
      address: updated.address,
      latitude: updated.latitude,
      longitude: updated.longitude,
      estimatedWeight: updated.estimatedWeight,
      scheduledDate: updated.scheduledDate.toISOString(),
      citizenName: updated.citizen.name ?? updated.citizen.email,
    },
  })
}
