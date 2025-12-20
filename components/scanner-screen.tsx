"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Camera, Upload } from "lucide-react"

interface ScannerScreenProps {
  onNavigate: (screen: string) => void
}

export default function ScannerScreen({ onNavigate }: ScannerScreenProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const stopCameraRef = useRef<null | (() => void)>(null)

  const [scanned, setScanned] = useState<null | {
    material: string
    recyclable: boolean
    category: string
    tips: string
  }>(null)

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isStartingCamera, setIsStartingCamera] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [gps, setGps] = useState<null | { lat: number; lng: number; accuracy?: number }>(null)
  const [gpsError, setGpsError] = useState<string | null>(null)
  const [gpsStatus, setGpsStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null)

  const materialDatabase = useMemo(
    () => ({
    plastic_1: {
      material: "Plastic #1 (PET)",
      recyclable: true,
      category: "Plastic",
      tips: "Rinse and remove caps before recycling. Common in soda and water bottles.",
    },
    plastic_2: {
      material: "Plastic #2 (HDPE)",
      recyclable: true,
      category: "Plastic",
      tips: "Accepted at most facilities. Found in milk jugs and detergent bottles.",
    },
    aluminum: {
      material: "Aluminum Cans",
      recyclable: true,
      category: "Metal",
      tips: "Highly valuable and infinitely recyclable. Rinse before recycling.",
    },
    glass: {
      material: "Glass Bottles",
      recyclable: true,
      category: "Glass",
      tips: "Keep separate from other recyclables. No lids or caps.",
    },
    plastic_foam: {
      material: "Polystyrene Foam",
      recyclable: false,
      category: "Plastic",
      tips: "Not accepted at most facilities. Consider reusing for storage.",
    },
    }),
    [],
  )

  const stopCamera = () => {
    stopCameraRef.current?.()
    stopCameraRef.current = null
  }

  const handleScan = (type: keyof typeof materialDatabase) => {
    setScanned(materialDatabase[type])
  }

  const handleAddPoints = () => {
    setScanned(null)
  }

  useEffect(() => {
    if (photoUrl) URL.revokeObjectURL(photoUrl)
  }, [scanned])

  useEffect(() => {
    if (!isCameraOpen) {
      stopCamera()
      setIsStartingCamera(false)
      return
    }

    let cancelled = false

    async function start() {
      if (!videoRef.current) return

      setScanError(null)
      setIsStartingCamera(true)

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        videoRef.current.srcObject = stream

        stopCameraRef.current = () => {
          for (const track of stream.getTracks()) {
            try {
              track.stop()
            } catch {
              // ignore
            }
          }
          if (videoRef.current) videoRef.current.srcObject = null
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to open camera"

        // Common cause: not https (except localhost).
        const isSecureContext = typeof window !== "undefined" && (window.isSecureContext ?? false)
        setScanError(
          isSecureContext
            ? message
            : "Camera requires a secure context (https or localhost).",
        )
        setIsCameraOpen(false)
      } finally {
        if (!cancelled) setIsStartingCamera(false)
      }
    }

    start()

    return () => {
      cancelled = true
      stopCamera()
    }
  }, [isCameraOpen])

  useEffect(() => {
    let cancelled = false

    const formatGeoError = (err: unknown) => {
      const code = (err as any)?.code
      if (code === 1) return "Location permission denied"
      if (code === 2) return "Location unavailable (check device location settings)"
      if (code === 3) return "Location request timed out"
      return "Unable to get location"
    }

    const requestLocation = (opts: PositionOptions, isFallback: boolean) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setGpsError("Geolocation not supported")
        setGpsStatus(null)
        return
      }

      setGpsError(null)
      setGpsStatus(isFallback ? "Retrying GPS (low accuracy)…" : "Getting GPS…")

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (cancelled) return
          setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy })
          setGpsError(null)
          setGpsStatus(null)
        },
        (err) => {
          if (cancelled) return
          const code = (err as any)?.code
          const message = formatGeoError(err)

          // If high accuracy is timing out, retry with a less strict request.
          if (code === 3 && !isFallback) {
            setGpsError("GPS timed out — retrying with low accuracy…")
            requestLocation({ enableHighAccuracy: false, maximumAge: 30_000, timeout: 60_000 }, true)
            return
          }

          setGpsError(message)
          setGpsStatus(null)
        },
        opts,
      )
    }

    // Grab GPS early to geotag the report.
    requestLocation({ enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 }, false)

    return () => {
      cancelled = true
    }
  }, [])

  const handleUploadClick = () => {
    setScanError(null)
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (file: File | null) => {
    if (!file) return
    setScanError(null)

    if (file.size > 6 * 1024 * 1024) {
      setScanError("Image too large (max 6MB)")
      return
    }

    setPhotoBlob(file)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(URL.createObjectURL(file))
  }

  const takePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    const width = video.videoWidth || 1280
    const height = video.videoHeight || 720
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9),
    )

    if (!blob) {
      setScanError("Could not capture photo")
      return
    }

    setPhotoBlob(blob)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(URL.createObjectURL(blob))
    setIsCameraOpen(false)
    stopCamera()
  }

  const resetPhoto = () => {
    setPhotoBlob(null)
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoUrl(null)
    setCreatedRequestId(null)
    setScanned(null)
    setScanError(null)
  }

  const submitReport = async () => {
    if (!photoBlob) {
      setScanError("Take or upload a photo first")
      return
    }
    if (!gps) {
      setScanError(gpsError ?? "Waiting for location…")
      return
    }

    setIsSubmitting(true)
    setScanError(null)

    try {
      const form = new FormData()
      form.append("image", photoBlob, "garbage.jpg")
      form.append("lat", String(gps.lat))
      form.append("lng", String(gps.lng))

      const res = await fetch("/api/citizen/report", { method: "POST", body: form })
      const json = await res.json().catch(() => null)

      if (!res.ok) {
        setScanError(json?.error ?? `Request failed (${res.status})`)
        return
      }

      setCreatedRequestId(json?.request?.id ?? null)
      const scan = json?.scan

      const materialName = typeof scan?.materialName === "string" ? scan.materialName : "Unknown"
      const category = typeof scan?.category === "string" ? scan.category : "OTHER"
      const recyclable = Boolean(scan?.isRecyclable)
      const confidence = typeof scan?.confidenceScore === "number" ? scan.confidenceScore : null

      setScanned({
        material: materialName,
        recyclable,
        category,
        tips: confidence != null ? `Confidence: ${(confidence * 100).toFixed(0)}%` : "",
      })
    } catch (err) {
      setScanError(err instanceof Error ? err.message : "Failed to submit")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-1 hover:bg-primary-foreground/20 rounded transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Scan Material</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6 pt-6">
        {!scanned ? (
          <>
            {/* Scanner Preview */}
            <div className="bg-gradient-to-b from-primary/20 to-accent/10 rounded-2xl p-8 flex flex-col items-center justify-center min-h-64 border-2 border-dashed border-primary/30">
              {!isCameraOpen ? (
                <>
                  <Camera className="w-12 h-12 text-primary mb-4" />
                  <p className="text-center text-sm text-muted-foreground mb-6">
                    Take a photo of the garbage. We'll geotag it and classify it.
                  </p>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => {
                      setScanError(null)
                      setIsCameraOpen(true)
                    }}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-full max-w-xl">
                    <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
                      <video
                        ref={videoRef}
                        className="w-full h-auto"
                        muted
                        playsInline
                        autoPlay
                      />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm text-muted-foreground">
                        {isStartingCamera ? "Starting camera…" : "Frame the garbage clearly"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                          onClick={() => setIsCameraOpen(false)}
                          disabled={isStartingCamera}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          onClick={takePhoto}
                          disabled={isStartingCamera}
                        >
                          Take Photo
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {scanError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{scanError}</p>
              </div>
            )}

            {gpsError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{gpsError}</p>
              </div>
            )}

            {gpsStatus && !gpsError && (
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-sm text-muted-foreground">{gpsStatus}</p>
              </div>
            )}

            {photoUrl && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Photo Preview</p>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <img src={photoUrl} alt="Garbage" className="w-full h-auto" />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary/10 bg-transparent"
                    onClick={() => {
                      resetPhoto()
                      setIsCameraOpen(true)
                    }}
                    disabled={isSubmitting}
                  >
                    Retake
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={submitReport}
                    disabled={isSubmitting || !gps}
                  >
                    {isSubmitting ? "Submitting…" : "Send for Classification"}
                  </Button>
                </div>
              </div>
            )}

            {/* Or upload */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
            />

            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
              onClick={handleUploadClick}
              disabled={isCameraOpen}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </Button>

            {/* Demo Results (fallback examples) */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Scan Results</p>
              <div className="grid gap-2">
                {Object.entries({
                  plastic_1: "Plastic #1",
                  aluminum: "Aluminum Can",
                  glass: "Glass Bottle",
                  plastic_foam: "Foam Packaging",
                }).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => handleScan(key as keyof typeof materialDatabase)}
                    className="bg-card border border-border rounded-lg p-3 hover:border-primary transition text-left"
                  >
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">Tap to see results</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Result Card */}
            <Card
              className={`border-2 ${scanned.recyclable ? "border-accent/50 bg-accent/5" : "border-destructive/50 bg-destructive/5"}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-foreground">{scanned.material}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 font-normal">{scanned.category}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      scanned.recyclable ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                    }`}
                  >
                    {scanned.recyclable ? "♻️ Recyclable" : "⚠️ Not Recyclable"}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-4 border border-border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {scanned.tips || "Classification complete."}
                  </p>
                </div>

                {createdRequestId && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <p className="text-sm font-semibold text-primary">Pickup request created</p>
                    <p className="text-xs text-muted-foreground mt-1">Request ID: {createdRequestId}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                handleAddPoints()
                resetPhoto()
              }}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              New Report
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
