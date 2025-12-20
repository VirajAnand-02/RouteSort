"use client"

import { useEffect, useRef } from "react"

interface MapContainerProps {
  selectedJob: string | null
  requests: Array<{
    id: string
    status: "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
    address: string
    latitude: number
    longitude: number
  }>
  routeMeta?: {
    totalDistanceKm: number | null
    estimatedTimeMin: number | null
  }
  onLocationChange?: (location: { lat: number; lng: number; accuracy?: number }) => void
  onLocationError?: (message: string) => void
}

export function MapContainer({
  selectedJob,
  requests,
  routeMeta,
  onLocationChange,
  onLocationError,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const leaflet = useRef<any>(null)
  const currentMarker = useRef<any>(null)
  const requestLayer = useRef<any>(null)
  const requestMarkersById = useRef<Map<string, any>>(new Map())
  const requestPolyline = useRef<any>(null)
  const watchId = useRef<number | null>(null)
  const hasCenteredOnUser = useRef(false)
  const fallbackStarted = useRef(false)

  const updateCurrentLocation = (lat: number, lng: number, accuracy?: number) => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return

    onLocationChange?.({ lat, lng, accuracy })

    if (currentMarker.current) {
      currentMarker.current.setLatLng([lat, lng])
    }

    if (!hasCenteredOnUser.current && map.current) {
      hasCenteredOnUser.current = true
      map.current.setView([lat, lng], 15)
    }
  }

  const formatGeoError = (err: any) => {
    const code = typeof err?.code === "number" ? err.code : undefined
    if (code === 1) return "Location permission denied"
    if (code === 2) return "Location unavailable (check Windows Location Services)"
    if (code === 3) return "Location request timed out"
    return "Unable to access location"
  }

  useEffect(() => {
    if (!mapContainer.current) return

    // Load Leaflet CSS and JS dynamically
    if (typeof window !== "undefined" && !(window as any).L) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
      script.onload = initMap
      document.body.appendChild(script)
    } else if ((window as any).L && !map.current) {
      initMap()
    }

    function initMap() {
      if (!mapContainer.current || map.current) return

      const L = (window as any).L
      leaflet.current = L

      const mapInstance = L.map(mapContainer.current).setView([37.7749, -122.4194], 14)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstance)

      requestLayer.current = L.layerGroup().addTo(mapInstance)

      // Current position marker
      const currentHtml = `
        <div style="
          width: 32px;
          height: 32px;
          background-color: #00ff88;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
        ">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>
      `

      currentMarker.current = L.marker([37.7749, -122.4194], {
        icon: L.divIcon({
          html: currentHtml,
          iconSize: [32, 32],
          className: "",
        }),
      })

      currentMarker.current.addTo(mapInstance).bindPopup("<strong>Current Location</strong>")

      map.current = mapInstance

      // Start live geolocation tracking once the map exists.
      if (typeof navigator !== "undefined" && navigator.geolocation && watchId.current === null) {
        const startWatch = (opts: PositionOptions) => {
          if (!navigator.geolocation) return
          if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current)
            watchId.current = null
          }
          watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
              updateCurrentLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
            },
            (err) => {
              const message = formatGeoError(err)
              onLocationError?.(message)
              // If high accuracy is timing out, retry with low accuracy and longer timeout.
              if (err?.code === 3 && !fallbackStarted.current) {
                fallbackStarted.current = true
                onLocationError?.("GPS timed out — retrying with low accuracy…")
                startWatch({ enableHighAccuracy: false, maximumAge: 30_000, timeout: 60_000 })
              }
            },
            opts,
          )
        }

        // Grab an immediate fresh fix first (avoid cached/old positions).
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            updateCurrentLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy)
          },
          (err) => {
            const message = formatGeoError(err)
            onLocationError?.(message)
            if (err?.code === 3 && !fallbackStarted.current) {
              fallbackStarted.current = true
              onLocationError?.("GPS timed out — retrying with low accuracy…")
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 20_000,
          },
        )

        startWatch({ enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 })
      } else if (typeof navigator !== "undefined" && !navigator.geolocation) {
        onLocationError?.("Geolocation not supported in this browser")
      }
    }

    return () => {
      if (watchId.current !== null && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current)
        watchId.current = null
      }
    }
  }, [])

  useEffect(() => {
    const L = leaflet.current
    const mapInstance = map.current
    const layer = requestLayer.current
    if (!L || !mapInstance || !layer) return

    // Clear old layers
    layer.clearLayers()
    requestMarkersById.current.clear()
    if (requestPolyline.current) {
      try {
        mapInstance.removeLayer(requestPolyline.current)
      } catch {
        // ignore
      }
      requestPolyline.current = null
    }

    const coords: Array<[number, number]> = []

    const statusColor = (status: string) => {
      switch (status) {
        case "COMPLETED":
          return "#4b7bff"
        case "IN_PROGRESS":
          return "#ff6b35"
        default:
          return "#94a3b8"
      }
    }

    requests
      .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
      .forEach((r, idx) => {
        coords.push([r.latitude, r.longitude])

        const color = statusColor(r.status)
        const html = `
          <div style="
            width: 28px;
            height: 28px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            font-size: 12px;
            color: white;
            font-weight: bold;
          ">
            ${idx + 1}
          </div>
        `

        const marker = L.marker([r.latitude, r.longitude], {
          icon: L.divIcon({ html, iconSize: [28, 28], className: "" }),
        })
        marker.addTo(layer)
        marker.bindPopup(`<strong>${r.address}</strong><br/>Status: ${r.status}`)
        requestMarkersById.current.set(r.id, marker)
      })

    if (coords.length >= 2) {
      requestPolyline.current = L.polyline(coords, {
        color: "#ff6b35",
        weight: 3,
        opacity: 0.7,
        dashArray: "5, 5",
      }).addTo(mapInstance)
    }
  }, [requests])

  useEffect(() => {
    const marker = selectedJob ? requestMarkersById.current.get(selectedJob) : null
    if (!marker || !map.current) return
    try {
      const latlng = marker.getLatLng()
      const current = currentMarker.current?.getLatLng?.()

      if (current) {
        map.current.fitBounds([latlng, current], { padding: [40, 40], maxZoom: 15 })
      } else {
        map.current.setView(latlng, Math.max(map.current.getZoom(), 15))
      }
      marker.openPopup()
    } catch {
      // ignore
    }
  }, [selectedJob])

  return (
    <div className="relative flex-1 bg-card rounded-lg border border-border overflow-hidden">
      <div ref={mapContainer} className="w-full h-full relative">
        {/* Map loads here via Leaflet */}
      </div>

      {/* Overlay stats */}
      {routeMeta?.totalDistanceKm != null && routeMeta?.estimatedTimeMin != null && (
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur border border-border rounded-lg p-3 pointer-events-none z-10">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Route</div>
          <div className="text-lg font-bold text-primary mt-1">{routeMeta.totalDistanceKm.toFixed(1)} km</div>
          <div className="text-xs text-muted-foreground">Est. {routeMeta.estimatedTimeMin} min</div>
        </div>
      )}
    </div>
  )
}
