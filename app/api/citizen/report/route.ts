import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { MaterialType, PickupStatus, PriorityLevel } from "@prisma/client"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth-options"

type GeminiClassification = {
  materialName: string
  category: MaterialType
  isRecyclable: boolean
  confidenceScore?: number | null
  estimatedWeightKg?: number | null
  estimatedVolumeLiters?: number | null
  priority?: "REGULAR" | "PRIORITY" | null
  notes?: string | null
}

function clampNumber(value: unknown, fallback: number, min: number, max: number) {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

function parseMaterialType(value: unknown): MaterialType {
  const raw = typeof value === "string" ? value.trim().toUpperCase() : ""
  if (raw in MaterialType) return raw as MaterialType
  return MaterialType.OTHER
}

function parsePriority(value: unknown): PriorityLevel {
  const raw = typeof value === "string" ? value.trim().toUpperCase() : ""
  if (raw === "PRIORITY") return PriorityLevel.PRIORITY
  return PriorityLevel.REGULAR
}

function extractJsonObject(text: string): unknown {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) return null
  const slice = text.slice(start, end + 1)
  try {
    return JSON.parse(slice)
  } catch {
    return null
  }
}

async function callGeminiForClassification(params: {
  base64: string
  mimeType: string
}): Promise<GeminiClassification> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set")
  }

  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash"

  const prompt =
    "You are classifying an image of garbage for a city waste pickup system. " +
    "Return ONLY valid JSON (no markdown). " +
    "Schema: {" +
    '"materialName": string, ' +
    '"category": "PLASTIC"|"PAPER"|"GLASS"|"METAL"|"ORGANIC"|"ELECTRONIC"|"OTHER", ' +
    '"isRecyclable": boolean, ' +
    '"confidenceScore": number (0..1), ' +
    '"estimatedWeightKg": number, ' +
    '"estimatedVolumeLiters": number, ' +
    '"priority": "REGULAR"|"PRIORITY", ' +
    '"notes": string' +
    "}"

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: params.mimeType,
                data: params.base64,
              },
            },
          ],
        },
      ],
      generationConfig: { temperature: 0.2 },
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Gemini request failed (${res.status}): ${body.slice(0, 400)}`)
  }

  const json = (await res.json()) as any
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error("Gemini returned no text")
  }

  const extracted = extractJsonObject(text)
  if (!extracted || typeof extracted !== "object") {
    throw new Error("Gemini response was not valid JSON")
  }

  const obj = extracted as any

  const materialName = typeof obj.materialName === "string" ? obj.materialName : "Unknown"
  const category = parseMaterialType(obj.category)
  const isRecyclable = Boolean(obj.isRecyclable)
  const confidenceScore = obj.confidenceScore == null ? null : clampNumber(obj.confidenceScore, 0.5, 0, 1)
  const estimatedWeightKg = obj.estimatedWeightKg == null ? null : clampNumber(obj.estimatedWeightKg, 2, 0.1, 100)
  const estimatedVolumeLiters =
    obj.estimatedVolumeLiters == null ? null : clampNumber(obj.estimatedVolumeLiters, 10, 0.1, 1000)
  const priority = obj.priority == null ? null : (typeof obj.priority === "string" ? obj.priority : null)
  const notes = typeof obj.notes === "string" ? obj.notes : null

  return {
    materialName,
    category,
    isRecyclable,
    confidenceScore,
    estimatedWeightKg,
    estimatedVolumeLiters,
    priority,
    notes,
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "CITIZEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const form = await req.formData()
  const image = form.get("image")
  const latRaw = form.get("lat")
  const lngRaw = form.get("lng")

  const lat = clampNumber(latRaw, NaN, -90, 90)
  const lng = clampNumber(lngRaw, NaN, -180, 180)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "Missing or invalid lat/lng" }, { status: 400 })
  }

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Missing image" }, { status: 400 })
  }

  const maxBytes = 6 * 1024 * 1024
  if (image.size > maxBytes) {
    return NextResponse.json({ error: "Image too large (max 6MB)" }, { status: 400 })
  }

  const mimeType = image.type || "image/jpeg"
  const bytes = Buffer.from(await image.arrayBuffer())
  const base64 = bytes.toString("base64")

  // Save to /public/uploads so we can reference it later.
  const ext = mimeType === "image/png" ? "png" : "jpg"
  const fileName = `${crypto.randomUUID()}.${ext}`
  const uploadAbs = path.join(process.cwd(), "public", "uploads", fileName)
  await fs.writeFile(uploadAbs, bytes)
  const publicUrl = `/uploads/${fileName}`

  const classification = await callGeminiForClassification({ base64, mimeType })

  const priority = parsePriority(classification.priority)
  const estimatedWeight = classification.estimatedWeightKg ?? 2
  const estimatedVolume = classification.estimatedVolumeLiters ?? 10

  const address = `Near ${lat.toFixed(5)}, ${lng.toFixed(5)}`

  const pickupRequest = await prisma.pickupRequest.create({
    data: {
      citizenId: userId,
      status: PickupStatus.PENDING,
      priority,
      address,
      latitude: lat,
      longitude: lng,
      estimatedWeight,
      estimatedVolume,
      description: classification.notes ?? classification.materialName,
      scheduledDate: new Date(),
    },
  })

  const wasteScan = await prisma.wasteScan.create({
    data: {
      userId,
      imageUrl: publicUrl,
      materialName: classification.materialName,
      category: classification.category,
      isRecyclable: classification.isRecyclable,
      confidenceScore: classification.confidenceScore,
      pointsAwarded: 0,
    },
  })

  return NextResponse.json({
    request: {
      id: pickupRequest.id,
      status: pickupRequest.status,
      priority: pickupRequest.priority,
      address: pickupRequest.address,
      latitude: pickupRequest.latitude,
      longitude: pickupRequest.longitude,
      scheduledDate: pickupRequest.scheduledDate.toISOString(),
    },
    scan: {
      id: wasteScan.id,
      imageUrl: wasteScan.imageUrl,
      materialName: wasteScan.materialName,
      category: wasteScan.category,
      isRecyclable: wasteScan.isRecyclable,
      confidenceScore: wasteScan.confidenceScore,
    },
  })
}
