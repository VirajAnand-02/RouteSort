"use client"

import { Navigation } from "lucide-react"
import { useEffect, useRef } from "react"

interface MapContainerProps {
  selectedJob: string | null
}

export function MapContainer({ selectedJob }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

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
      const mapInstance = L.map(mapContainer.current).setView([37.7749, -122.4194], 14)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstance)

      // Dummy pickup locations
      const pickupLocations = [
        { lat: 37.7749, lng: -122.4194, name: "Location A", status: "completed" },
        { lat: 37.7849, lng: -122.4094, name: "Location B", status: "pending" },
        { lat: 37.7649, lng: -122.4294, name: "Location C", status: "in-progress" },
        { lat: 37.7749, lng: -122.4294, name: "Location D", status: "pending" },
      ]

      // Add markers for pickup locations
      pickupLocations.forEach((location) => {
        const color =
          location.status === "completed" ? "#4b7bff" : location.status === "in-progress" ? "#ff6b35" : "#94a3b8"

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
          </div>
        `

        const marker = L.marker([location.lat, location.lng], {
          icon: L.divIcon({
            html,
            iconSize: [28, 28],
            className: "",
          }),
        }).addTo(mapInstance)

        marker.bindPopup(`<strong>${location.name}</strong><br/>Status: ${location.status}`)
      })

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

      L.marker([37.7749, -122.4194], {
        icon: L.divIcon({
          html: currentHtml,
          iconSize: [32, 32],
          className: "",
        }),
      })
        .addTo(mapInstance)
        .bindPopup("<strong>Current Location</strong><br/>Downtown Hub")

      // Draw route as polyline
      const routeCoordinates = [
        [37.7749, -122.4194],
        [37.7849, -122.4094],
        [37.7649, -122.4294],
        [37.7749, -122.4294],
      ]

      L.polyline(routeCoordinates, {
        color: "#ff6b35",
        weight: 3,
        opacity: 0.7,
        dashArray: "5, 5",
      }).addTo(mapInstance)

      map.current = mapInstance
    }
  }, [])

  return (
    <div className="flex-1 bg-card rounded-lg border border-border overflow-hidden">
      <div ref={mapContainer} className="w-full h-full relative">
        {/* Map loads here via Leaflet */}
      </div>

      {/* Overlay stats */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur border border-border rounded-lg p-3 pointer-events-none z-10">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Route</div>
        <div className="text-lg font-bold text-primary mt-1">3.2 km</div>
        <div className="text-xs text-muted-foreground">Est. 12 min</div>
      </div>

      {/* Current position info */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur border border-border rounded-lg p-3 flex items-center gap-2 pointer-events-none z-10">
        <Navigation className="w-4 h-4 text-primary" />
        <div>
          <div className="text-xs font-medium text-muted-foreground">Current Location</div>
          <div className="text-sm font-semibold text-foreground">Downtown Hub</div>
        </div>
      </div>
    </div>
  )
}
